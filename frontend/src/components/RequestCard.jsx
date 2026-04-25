export default function RequestCard({ data }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px"
        }}>
            <h4>{data.title}</h4>
            <p>{data.location} - {data.people} people</p>
            <p><b>Priority:</b> {data.priority}</p>

            <button style={{ background: "green", color: "white" }}>
                Help Now
            </button>
        </div>
    );
}