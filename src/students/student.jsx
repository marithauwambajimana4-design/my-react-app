import { useParams } from "react-router-dom";

function Student() {
    const { id } = useParams();

    return (
        <main>
            <h1>Student</h1>
            <p>ID: {id}</p>
            <p>Name:martha</p>
        </main>
    );
}

export default Student;