/**
 * Scoring Engine for PHQ-9 and GAD-7 Mental Health Assessments
 */

export function calculatePHQ9Score(answers) {
    if (!Array.isArray(answers) || answers.length !== 9) {
        throw new Error("PHQ-9 requires exactly 9 answers");
    }

    const score = answers.reduce((sum, answer) => sum + answer, 0);

    let severity, message, counselorReferral;

    if (score <= 4) {
        severity = "none_minimal";
        message = "You're doing okay. Keep checking in weekly!";
        counselorReferral = false;
    } else if (score <= 9) {
        severity = "mild";
        message = "Some symptoms — try a breathing exercise or journaling?";
        counselorReferral = false;
    } else if (score <= 14) {
        severity = "moderate";
        message = "Consider talking to a counselor soon. You don't have to do this alone.";
        counselorReferral = false;
    } else if (score <= 19) {
        severity = "moderately_severe";
        message = "Strongly recommend booking a counselor session. We can help you connect.";
        counselorReferral = true;
    } else {
        severity = "severe";
        message = "Please connect with a counselor immediately. Tap below to book a confidential slot.";
        counselorReferral = true;
    }

    return {
        score,
        severity,
        message,
        counselorReferral
    };
}

export function calculateGAD7Score(answers) {
    if (!Array.isArray(answers) || answers.length !== 7) {
        throw new Error("GAD-7 requires exactly 7 answers");
    }

    const score = answers.reduce((sum, answer) => sum + answer, 0);

    let severity, message, counselorReferral;

    if (score <= 4) {
        severity = "none_minimal";
        message = "Low anxiety — great! Keep using calm tools.";
        counselorReferral = false;
    } else if (score <= 9) {
        severity = "mild";
        message = "Mild stress — try a guided meditation or walk?";
        counselorReferral = false;
    } else if (score <= 14) {
        severity = "moderate";
        message = "Moderate anxiety — counselor chat recommended. Tap to book.";
        counselorReferral = true;
    } else {
        severity = "severe";
        message = "High anxiety — please book counselor now. Immediate support available.";
        counselorReferral = true;
    }

    return {
        score,
        severity,
        message,
        counselorReferral
    };
}

