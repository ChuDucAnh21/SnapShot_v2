// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

// Health endpoint types
export type HealthResponse = {
  status: 'ok';
  db: string;
};

// Subjects endpoint types
export type Subject = {
  code: string;
  name: string;
};

export type SubjectsResponse = Subject[];

// Courses endpoint types
export type Course = {
  code: string;
  name: string;
  subject_code: string;
  age_band: string;
};

export type CoursesResponse = Course[];

// Tracks endpoint types
export type Track = {
  code: string;
  name: string;
};

export type TracksResponse = Track[];

// Track path endpoint types
export type PathNodeType = 'unit_start' | 'lesson' | 'unit_end';

export type PathNode = {
  index: number;
  type: PathNodeType;
  unit_code: string;
  lesson_code: string | null;
  title: string | null;
};

export type Unit = {
  code: string;
  title: string;
  index_in_track: number;
};

export type TrackPathResponse = {
  track_code: string;
  units: Unit[];
  path_nodes: PathNode[];
};

// Lesson detail endpoint types
export type ActivityOutline = 'warmup' | 'learning' | 'practice' | 'memorize';

export type LessonDetail = {
  code: string;
  title: string;
  stt_label: string;
  summary: string;
  objectives: string;
  illustration: string;
  game_ideas: string;
  activity_outline: ActivityOutline[];
  anchors: string[];
};

export type LessonDetailResponse = LessonDetail;

// Anchor equivalents endpoint types
export type AnchorEquivalent = {
  track_code: string;
  lesson_code: string;
  index_in_track: number;
};

export type AnchorEquivalentsResponse = AnchorEquivalent[];

// Catalog endpoints types
export type CatalogCourse = {
  course_code: string;
  course_name: string;
  age_band: string;
  tracks_count: number;
};

export type CatalogSubject = {
  subject_code: string;
  subject_name: string;
  courses: CatalogCourse[];
};

export type CatalogSubjectsResponse = CatalogSubject[];

export type CatalogLesson = {
  code: string;
  title: string;
  stt_label: string;
  anchors: string[];
};

export type CatalogUnit = {
  code: string;
  title: string;
  index_in_track: number;
  lessons: CatalogLesson[];
};

export type CatalogTrackOverview = {
  code: string;
  name: string;
  units: CatalogUnit[];
};

export type CatalogTrackOverviewResponse = CatalogTrackOverview;
