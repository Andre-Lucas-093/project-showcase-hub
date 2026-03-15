import type { Request, Response } from 'express';
import { listCourseSummaries } from '../models/courses.js';

export const list = async (req: Request, res: Response) => {
  const courses = await listCourseSummaries();
  const categoria = req.query.categoria;

  if (categoria === undefined) {
    res.json(courses);
    return;
  }

  if (categoria !== 'graduacao' && categoria !== 'pos_graduacao') {
    res.status(400).json({ error: 'categoria invalida. Use graduacao ou pos_graduacao' });
    return;
  }

  res.json(courses.filter(course => course.categoria === categoria));
};