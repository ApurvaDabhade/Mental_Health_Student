import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { getLocalSupportReply } from "../utils/chatUtils";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL != null && import.meta.env.VITE_API_BASE_URL !== ""
    ? `${String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, "")}/sahaay`
    : "/api/sahaay";

const START_SESSION_TIMEOUT_MS = 10000;
const HTTP_TIMEOUT_MS = 25000;

function isLocalSessionId(sid) {
  return sid != null && String(sid).startsWith("local_");
}

function getUserId() {
  const appId = localStorage.getItem("userId");
  if (appId) {
    localStorage.setItem("sahaay_userId", appId);
    return appId;
  }
  let sid = localStorage.getItem("sahaay_userId");
  if (!sid) {
    sid = `user_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("sahaay_userId", sid);
  }
  return sid;
}

const useWellnessChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [distressLevel, setDistressLevel] = useState(1);
  const [sessionId, setSessionId] = useState("");
  const sessionIdRef = useRef("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userId] = useState(() => getUserId());
  const [error, setError] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: HTTP_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.response.use(
    (response) => response,
    (err) => {
      console.error("Sahaay API:", err);
      return Promise.reject(err);
    },
  );

  const addSystemMessage = useCallback((text, type = "info") => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "system",
        type,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addMessage = useCallback((text, sender = "bot", type = "text") => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender,
        type,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const startSession = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), START_SESSION_TIMEOUT_MS);
    try {
      setError(null);
      setIsTyping(true);

      const response = await api.post(
        "/start_session",
        {
          userId,
          initialDistressScore: 1,
        },
        { signal: controller.signal },
      );

      const sid = response.data.sessionId != null ? String(response.data.sessionId) : "";
      setSessionId(sid);
      sessionIdRef.current = sid;
      setIsSessionActive(true);

      const welcomeText =
        response.data.message?.text ||
        response.data.welcomeMessage?.text ||
        "Hi — I'm Manas Veda. How are you feeling today?";

      setMessages([
        {
          id: Date.now(),
          text: welcomeText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      setSessionReady(true);
      setIsTyping(false);
      return sid;
    } catch (err) {
      console.error("Start session error:", err);
      const localSessionId = `local_${Date.now()}`;
      setSessionId(localSessionId);
      sessionIdRef.current = localSessionId;
      setIsSessionActive(true);
      setError(null);
      setMessages([
        {
          id: Date.now(),
          text: "Hi — I'm Manas Veda. How are you feeling today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setSessionReady(true);
      setIsTyping(false);
      return localSessionId;
    } finally {
      clearTimeout(timeoutId);
    }
  }, [userId, addSystemMessage]);

  const endSession = useCallback(async () => {
    const sid = sessionIdRef.current || sessionId;
    if (!sid) return;
    try {
      setIsTyping(true);
      await api.post(`/end_session`, { sessionId: sid, userId });
      setIsSessionActive(false);
      setSessionId("");
      sessionIdRef.current = "";
      addSystemMessage("Session ended. Start a new one whenever you're ready.", "info");
    } catch (e) {
      addSystemMessage("Could not end session on the server.", "error");
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId, addSystemMessage]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) {
        addSystemMessage("Please type a message.", "warning");
        return;
      }

      let sid = sessionIdRef.current || sessionId;
      if (!sid || !isSessionActive) {
        sid = await startSession();
      }

      const userMessage = {
        id: Date.now(),
        text,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      if (isLocalSessionId(sid)) {
        const reply = getLocalSupportReply(text);
        const t = text.toLowerCase();
        if (/sad|depress|hopeless|anx|panic|stress|overwhelm|scared|hurt/i.test(t)) {
          setDistressLevel((d) => Math.min(4, Math.max(2, d)));
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: reply,
            sender: "bot",
            timestamp: new Date(),
            interventionType: "DBT",
            type: "text",
          },
        ]);
        setIsTyping(false);
        return;
      }

      try {
        const response = await api.post("/chat", {
          message: text,
          sessionId: sid,
          userId,
        });

        const payload = response.data.response || response.data;
        const botText =
          typeof payload === "string" ? payload : payload?.text || "I'm here with you.";
        const interventionType = payload?.interventionType;

        const botMessage = {
          id: Date.now() + 1,
          text: botText,
          sender: "bot",
          timestamp: new Date(),
          interventionType,
          type: "text",
        };
        setMessages((prev) => [...prev, botMessage]);

        const d = response.data.distressLevel ?? response.data.distressScore;
        if (d !== undefined && d !== null) {
          setDistressLevel(Number(d));
        }
        if (response.data.sessionId && String(response.data.sessionId) !== sid) {
          const ns = String(response.data.sessionId);
          setSessionId(ns);
          sessionIdRef.current = ns;
        }
      } catch (err) {
        const reply = getLocalSupportReply(text);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: reply,
            sender: "bot",
            timestamp: new Date(),
            interventionType: "DBT",
            type: "text",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId, userId, isSessionActive, startSession, addSystemMessage],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setDistressLevel(1);
    setError(null);
    setSessionId("");
    sessionIdRef.current = "";
    setIsSessionActive(false);
    setSessionReady(false);
    startSession();
  }, [startSession]);

  const initializingRef = useRef(false);
  useEffect(() => {
    const init = async () => {
      if (initializingRef.current || sessionReady) return;
      initializingRef.current = true;
      try {
        await startSession();
      } finally {
        initializingRef.current = false;
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messages,
    sendMessage,
    isTyping,
    distressLevel,
    error,
    sessionId,
    sessionReady,
    isSessionActive,
    startSession,
    endSession,
    addMessage,
    addSystemMessage,
    clearChat,
  };
};

export default useWellnessChat;
