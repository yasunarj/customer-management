import { headers } from "next/headers"

export const getPathnameFromHeaders = async () => {
  const headersList = await headers();
  return headersList.get("x-pathname");
}