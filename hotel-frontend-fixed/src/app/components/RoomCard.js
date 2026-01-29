
// // components/RoomCard.jsx

// "use client";

// import { useMemo } from 'react';

// // --- Utility function to get image URL based on room type ---
// const getRoomImageUrl = (typeName) => {
//     const lowerCaseType = typeName ? typeName.toLowerCase() : "";

//     // Reliable Image URLs
//     if (lowerCaseType.includes("suite")) {
//         return "https://images.unsplash.com/photo-1595562799309-8d77e0d3765e?q=80&w=600&auto=format&fit=crop"; 
//     }
//     if (lowerCaseType.includes("deluxe") || lowerCaseType.includes("king")) {
//         return "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600&auto=format&fit=crop";
//     }
//     if (lowerCaseType.includes("double") || lowerCaseType.includes("twin")) {
//         return "https://images.unsplash.com/photo-1560662657-22cc26372134?q=80&w=600&auto=format&fit=crop";
//     }
//     if (lowerCaseType.includes("single") || lowerCaseType.includes("standard")) {
//         return "https://images.unsplash.com/photo-1588667355106-96b5a76c8e31?q=80&w=600&auto=format&fit=crop";
//     }
    
//     // Default fallback image
//     return "https://images.unsplash.com/photo-1571896349141-93d6995641c2?q=80&w=600&auto=format&fit=crop";
// };
// // ----------------------------------------------------------------------

// // PKR format (No decimals for cleaner look)
// function fmtCurrency(num) {
//     return new Intl.NumberFormat("en-PK", {
//         style: "currency",
//         currency: "PKR",
//         minimumFractionDigits: 0,
//     }).format(Number(num || 0));
// }

// export default function RoomCard({ room }) {
//     // Price formatting to display PKR properly
//     const priceDisplay = useMemo(() => {
//         return fmtCurrency(room.base_price || room.price || 0);
//     }, [room.base_price, room.price]);

//     // Image URL ko room data ya type name se decide karna
//     const imageUrl = room.imageUrl || getRoomImageUrl(room.type_name);

//     return (
//         // Layout: bg-white rounded-lg shadow p-4 flex flex-col (Wahi purana layout)
//         <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            
//             {/* ⭐ FIX: Image Placeholder ko <img> tag se replace kiya */}
//             <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
//                 <img
//                     src={imageUrl} 
//                     alt={`${room.type_name || 'Room'} image`}
//                     className="w-full h-full object-cover rounded-md" 
//                     // Fallback agar primary URL fail ho jaye
//                     onError={(e) => {
//                         e.target.onerror = null; 
//                         e.target.src = "https://images.unsplash.com/photo-1517840899201-197e2f5f190e?q=80&w=600&auto=format&fit=crop"; 
//                     }}
//                 />
//             </div>
            
//             <div className="flex-1">
//                 {/* Saari Details Barkarar hain */}
//                 <h3 className="text-lg font-semibold">{room.type_name || "Room"}</h3>
//                 <p className="text-sm text-gray-600">Room #: {room.room_number || "-"}</p>
                
//                 {/* ⭐ FIX: Price ko formatted use kar rahe hain */}
//                 <p className="mt-2 text-gray-800 font-medium">{priceDisplay}/night</p>
                
//                 <p className="text-sm text-gray-600">Capacity: {room.capacity || "-"}</p>
//             </div>

//             {/* Buttons Section (No change) */}
//             <div className="mt-4 flex gap-2">
//                 <a
//                     href={`/rooms/${room.room_id}`}
//                     className="flex-1 text-center border px-3 py-2 rounded"
//                 >
//                     View Details
//                 </a>

//                 <a
//                     href={`/rooms/${room.room_id}`} // Assuming book link is room_id for simplicity, but room_type_id is safer
//                     className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-center"
//                 >
//                     Book Now
//                 </a>
//             </div>
//         </div>
//     );
// }

"use client";

import { useMemo } from 'react';

// --- Updated Utility function with high-quality, reliable room images ---
const getRoomImageUrl = (typeName) => {
    const lowerCaseType = typeName ? typeName.toLowerCase() : "";

    // Specific high-res Unsplash IDs for hotel interiors
    if (lowerCaseType.includes("suite")) {
        // Luxury Penthouse/Suite style
        return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"; 
    }
    if (lowerCaseType.includes("deluxe") || lowerCaseType.includes("king")) {
        // Spacious King Room
        return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80";
    }
    if (lowerCaseType.includes("double") || lowerCaseType.includes("twin")) {
        // Modern Double/Twin Bed Room
        return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80";
    }
    if (lowerCaseType.includes("single") || lowerCaseType.includes("standard")) {
        // Clean Standard Room
        return "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=600&q=80";
    }
    
    // Default fallback image: High-quality Hotel Bedroom
    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80";
};
// ----------------------------------------------------------------------

function fmtCurrency(num) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
    }).format(Number(num || 0));
}

export default function RoomCard({ room }) {
    const priceDisplay = useMemo(() => {
        return fmtCurrency(room.base_price || room.price || 0);
    }, [room.base_price, room.price]);

    const imageUrl = room.imageUrl || getRoomImageUrl(room.type_name);

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition-shadow duration-300">
            
            <div className="h-40 bg-gray-200 rounded-md mb-4 overflow-hidden">
                <img
                    src={imageUrl} 
                    alt={`${room.type_name || 'Room'} image`}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                        e.target.onerror = null; 
                        // Neutral fallback if the primary link breaks
                        e.target.src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80"; 
                    }}
                />
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{room.type_name || "Room"}</h3>
                <p className="text-sm text-gray-600">Room #: {room.room_number || "-"}</p>
                
                <p className="mt-2 text-blue-700 font-bold">{priceDisplay}/night</p>
                
                <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Capacity:</span> {room.capacity || "2"} Persons
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                <a
                    href={`/rooms/${room.room_id}`}
                    className="flex-1 text-center border border-gray-300 px-3 py-2 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    View Details
                </a>

                <a
                    href={`/rooms/${room.room_id}`} 
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-center font-medium hover:bg-blue-700 transition-colors"
                >
                    Book Now
                </a>
            </div>
        </div>
    );
}