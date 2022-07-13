import { Users } from "../../components/templates/Search/Users";
import { useRouter } from "next/router"

export default function userName() {
  const { userName } = useRouter().query;

  return (
    <Users 
      searchQuery={userName}
    />
  );
}