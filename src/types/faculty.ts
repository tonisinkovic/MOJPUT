export type Faculty = {
  id: string;
  name: string;
  city: string;
  area: string;
  description: string;
  longDescription?: string;
  logoUrl: string;
  coverImageUrl?: string;
  websiteUrl?: string;
  studentCount?: number;
  media?: {
    id: string;
    type: "image" | "video";
    url: string;
    thumbnailUrl?: string;
    title: string;
  }[];
  verified: boolean;
};

export type FacultyUser = {
  id: string;
  email: string;
  username?: string;
  password: string;
  facultyId: string;
};

export type FacultyPost = {
  id: string;
  facultyId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
};
