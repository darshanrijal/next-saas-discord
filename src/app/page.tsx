import { api } from "@/lib/api";

export default async function Page() {
  const res = await api.hello.$get();
  const data = await res.json();

  return <p>{data.message}</p>;
}
