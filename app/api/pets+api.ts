const pets = [
   {
      id: 1,
      name: "Luna",
      rfid: "A1B2C3D4",
      photo: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
   },
   {
      id: 2,
      name: "Max",
      rfid: "E5F6G7H8",
      photo: "https://images.pexels.com/photos/1870376/pexels-photo-1870376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
   }
];

export async function GET(request: Request) {
   return Response.json({ pets });
}
