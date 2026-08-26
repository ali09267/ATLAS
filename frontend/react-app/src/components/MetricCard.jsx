function MetricCard({ data }) {
  if (!data) return null;

  return (
    <div className="card bg-dark text-white mt-3 shadow">
      <div className="card-body text-center">
        <h5 className="card-title">{data.title}</h5>

        <h1 className="display-4 fw-bold text-info mt-3">{data.value}</h1>
      </div>
    </div>
  );
}

export default MetricCard;
