function Logout({onConfirm,onCancel}){
    return(<>
     <div style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div className="card p-5 text-center" style={{ width: "350px" , height:"400px"}}>
        <h5 className="mb-3">Are you sure you want to logout?</h5>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Logout</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
    </>)
}
export default Logout;