

const addCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const docRef = await addDoc(collection(db, 'courses'), courseData);
    res.status(201).json({ message: 'Course added!', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
};

export default addCourse;
