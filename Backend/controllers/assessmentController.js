import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePHQ9Score, calculateGAD7Score } from '../utils/score_engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get assessment questions
// @route   POST /api/assess
// @access  Public
export const getAssessmentQuestions = async (req, res) => {
    try {
        const { assessment_type, context } = req.body;

        // Validate assessment_type
        if (!assessment_type || !['PHQ9', 'GAD7'].includes(assessment_type)) {
            return res.status(400).json({ 
                message: 'Invalid assessment_type. Must be "PHQ9" or "GAD7"' 
            });
        }

        // Load questions from JSON file
        const questionsPath = path.join(__dirname, '../data/questions.json');
        const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

        const questions = questionsData[assessment_type];

        if (!questions || questions.length === 0) {
            return res.status(404).json({ 
                message: `No questions found for assessment type: ${assessment_type}` 
            });
        }

        // Format questions for response (ignore variants for now, use original text)
        const formattedQuestions = questions.map(q => ({
            q_id: q.id,
            text: q.original,
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        }));

        res.status(200).json(formattedQuestions);
    } catch (error) {
        console.error('Get Assessment Questions Error:', error);
        res.status(500).json({ 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

// @desc    Submit assessment responses
// @route   POST /api/submit
// @access  Public
export const submitAssessment = async (req, res) => {
    try {
        const { int_id, assessment_type, responses, context } = req.body;

        // Validate required fields
        if (!assessment_type || !['PHQ9', 'GAD7'].includes(assessment_type)) {
            return res.status(400).json({ 
                message: 'Invalid assessment_type. Must be "PHQ9" or "GAD7"' 
            });
        }

        if (!responses || !Array.isArray(responses)) {
            return res.status(400).json({ 
                message: 'Responses must be an array' 
            });
        }

        // Validate responses length
        const expectedLength = assessment_type === 'PHQ9' ? 9 : 7;
        if (responses.length !== expectedLength) {
            return res.status(400).json({ 
                message: `${assessment_type} requires exactly ${expectedLength} responses` 
            });
        }

        // Extract answers array from responses
        const answers = responses.map(r => {
            if (typeof r.answer !== 'number' || r.answer < 0 || r.answer > 3) {
                throw new Error('Each answer must be a number between 0 and 3');
            }
            return r.answer;
        });

        // Calculate score using scoring engine
        let result;
        if (assessment_type === 'PHQ9') {
            result = calculatePHQ9Score(answers);
        } else {
            result = calculateGAD7Score(answers);
        }

        // Determine next_step_url based on severity
        let next_step_url = null;
        if (result.severity === 'moderate' || 
            result.severity === 'moderately_severe' || 
            result.severity === 'severe') {
            next_step_url = `/book?ref=${assessment_type}&score=${result.score}`;
        }

        res.status(200).json({
            total_score: result.score,
            severity: result.severity,
            message: result.message,
            next_step_url: next_step_url
        });
    } catch (error) {
        console.error('Submit Assessment Error:', error);
        res.status(500).json({ 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

