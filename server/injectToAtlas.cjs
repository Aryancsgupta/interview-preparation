// Write a file to inject ai_interview_platform.questions.json into AtlasFS at server start.
import fs from 'fs';
import path from 'path';
const atlasInjectPath = path.join(__dirname, './atlas_inject_questions.json');

const questionsFilePath = path.join(__dirname, '..', 'ai_interview_platform.questions.json');
const questionsData = fs.readFileSync(questionsFilePath, 'utf-8');
fs.writeFileSync(atlasInjectPath, questionsData, 'utf-8');
console.log(`Injected questions data into ${atlasInjectPath}`);
