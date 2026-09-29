import { highSchools } from "@/data/highSchools";
import type { SchoolPost } from "@/lib/schoolCmsApi";
import { slugForSchool } from "@/lib/schoolSlug";

/** Primjer objave na profilu SŠ Jure Kaštelan (Omiš), da se vidi izgled članka. */
const DEMO_SCHOOL_ID = "ss-304";
export const DEMO_POST_SLUG = "dan-otvorenih-vrata-2026";

export function demoSchoolPosts(): SchoolPost[] {
  const school = highSchools.find((item) => item.id === DEMO_SCHOOL_ID);
  if (!school) return [];
  const slug = slugForSchool(school, highSchools);
  const publishedAt = "2026-03-18T09:00:00.000Z";
  return [
    {
      id: -3041,
      schoolId: school.id,
      schoolSlug: slug,
      schoolName: school.name,
      schoolCity: school.city,
      title: "Dan otvorenih vrata — 10. travnja",
      content:
        "Pozivamo učenike 8. razreda i roditelje da nas posjete u petak, 10. travnja, od 9 do 13 sati.\n\nMožeš proći radionice, razgovarati s nastavnicima i vidjeti kako izgleda običan školski dan. Na infopultu dobivaš popis programa i upisne rokove.\n\nNije potrebna prijava. Dođi na glavni ulaz, Trg kralja Tomislava 2.",
      slug: DEMO_POST_SLUG,
      category: "dogadaj",
      linkUrl: school.website,
      status: "PUBLISHED",
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      images: [
        {
          id: -30411,
          url: "/schools/demo/otvorena-vrata.jpg",
          alt: "Dvorište škole na danu otvorenih vrata",
          sortOrder: 0,
        },
        {
          id: -30412,
          url: "/schools/demo/radionica.jpg",
          alt: "Radionica u strukovnom kabinetu",
          sortOrder: 1,
        },
        {
          id: -30413,
          url: "/schools/demo/programi.jpg",
          alt: "Stol s informacijama o programima",
          sortOrder: 2,
        },
      ],
    },
  ];
}

export function mergeDemoSchoolPosts(slug: string, existing: SchoolPost[]): SchoolPost[] {
  const extra = demoSchoolPosts().filter((post) => post.schoolSlug === slug);
  if (!extra.length) return existing;
  if (existing.some((post) => post.slug === DEMO_POST_SLUG)) return existing;
  return [...extra, ...existing];
}
