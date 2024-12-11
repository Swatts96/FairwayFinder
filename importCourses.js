import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Fix __dirname issue in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to courses.json
const filePath = path.join(__dirname, 'public', 'courses.json');

// Read and parse the JSON file
const coursesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

function sanitizeCourse(course) {
    const sanitized = { ...course };
  
    // Rename reserved fields
    if (sanitized.id) {
      sanitized._id = sanitized.id; // Map `id` to `_id`
      delete sanitized.id;
    }
  
    // Remove null or undefined fields
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === null || sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
  
    // Handle deeply nested objects
    if (sanitized.pricing) {
      sanitized.pricing = {
        weekday: sanitized.pricing.weekday || {},
        weekend: sanitized.pricing.weekend || {},
      };
    }
  
    return sanitized;
  }
  
  



// Run the import function
importCourses();
