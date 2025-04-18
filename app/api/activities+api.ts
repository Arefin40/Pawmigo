const activities = [
   {
      id: "1",
      type: "scheduled",
      timestamp: "2023-10-15T08:00:00",
      details: "50g dispensed"
   },
   {
      id: "2",
      type: "manual",
      timestamp: "2023-10-15T12:30:00",
      details: "30g dispensed"
   },
   {
      id: "3",
      type: "scan",
      timestamp: "2023-10-15T12:35:00",
      details: "Luna scanned at feeder"
   },
   {
      id: "4",
      type: "error",
      timestamp: "2023-10-15T14:00:00",
      details: "Feeder jam detected"
   },
   {
      id: "5",
      type: "connection",
      timestamp: "2023-10-15T15:00:00",
      details: "Feeder went offline"
   }
];

export async function GET(request: Request) {
   return Response.json({ activities });
}
