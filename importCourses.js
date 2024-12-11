import { db } from './public/utility/firebase.js'; // Adjust path as necessary
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
  
  
  const importCourses = async () => {
    try {
      const coursesCollection = 'courses';
  
      for (const course of coursesData) {
        try {
          const sanitizedCourse = sanitizeCourse(course);
  
          // Use a custom ID, e.g., course name
          const docId = sanitizedCourse.name.replace(/\s+/g, '-').toLowerCase();
  
          await setDoc(doc(db, coursesCollection, docId), sanitizedCourse);
          console.log(`Added course with ID: ${docId}`);
        } catch (error) {
          console.error(
            `Error importing course: ${JSON.stringify(course, null, 2)}\nSanitized Course: ${JSON.stringify(sanitizedCourse, null, 2)}\nError: ${error.message}`
          );
        }
      }
  
      console.log('All courses imported successfully!');
    } catch (error) {
      console.error('Critical error during import process:', error.message);
    }
  };
  
  



// Run the import function
importCourses();
