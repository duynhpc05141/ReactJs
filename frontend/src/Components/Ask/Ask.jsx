import { useParams } from "react-router-dom";
import FormPosts from "../../admin/Actions/Posts/FormPosts";


export default function Ask() {
const {id}=useParams();

	return (
		<>
			<FormPosts />

		</>
	);
}
