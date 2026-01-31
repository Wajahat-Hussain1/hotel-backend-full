export async function POST(req) {
  try {
    const body = await req.json();
    
    // ✅ FIXED: Use the Environment Variable for the Backend URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // Fetch all rooms from Render backend
    const backendRes = await fetch(`${API_URL}/api/rooms`);
    
    if (!backendRes.ok) {
        throw new Error(`Backend responded with status: ${backendRes.status}`);
    }

    const allRooms = await backendRes.json();
    
    // handle both shapes { success, message, data } or plain array
    let rooms = Array.isArray(allRooms) ? allRooms : (allRooms.data || []);
    
    // filter by status
    const available = rooms.filter(r => r.status !== 'occupied' && r.status !== 'maintenance');
    
    return new Response(JSON.stringify(available), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}