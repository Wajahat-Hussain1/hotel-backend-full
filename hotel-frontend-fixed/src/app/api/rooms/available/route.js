
export async function POST(req) {
  try {
    const body = await req.json();
    // Fetch all rooms from backend and filter by status
    const backendRes = await fetch("http://localhost:5000/api/rooms");
    const allRooms = await backendRes.json();
    // backend returns { success, message, data } - handle both shapes
    let rooms = allRooms;
    if (allRooms && allRooms.data) rooms = allRooms.data;
    // filter by status not occupied
    const available = rooms.filter(r => r.status !== 'occupied' && r.status !== 'maintenance');
    return new Response(JSON.stringify(available), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
