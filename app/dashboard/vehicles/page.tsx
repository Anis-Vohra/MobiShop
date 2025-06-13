import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  // Mock data for vehicles
  const vehicles = [
    {
      id: "1",
      make: "Honda",
      model: "Civic",
      year: "2018",
      licensePlate: "ABC123",
      vin: "1HGCM82633A123456",
      owner: "John Smith",
      lastService: "2023-05-15",
    },
    {
      id: "2",
      make: "Toyota",
      model: "Camry",
      year: "2020",
      licensePlate: "XYZ789",
      vin: "4T1BF1FK5CU123456",
      owner: "Sarah Johnson",
      lastService: "2023-06-02",
    },
    {
      id: "3",
      make: "Ford",
      model: "F-150",
      year: "2019",
      licensePlate: "DEF456",
      vin: "1FTEW1EP5JFA12345",
      owner: "Mike Williams",
      lastService: "2023-04-28",
    },
    {
      id: "4",
      make: "Chevrolet",
      model: "Malibu",
      year: "2021",
      licensePlate: "GHI789",
      vin: "1G1ZD5ST1JF123456",
      owner: "Emily Davis",
      lastService: "2023-06-10",
    },
    {
      id: "5",
      make: "Nissan",
      model: "Altima",
      year: "2017",
      licensePlate: "JKL012",
      vin: "1N4AL3AP7FC123456",
      owner: "Robert Brown",
      lastService: "2023-05-22",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Management</CardTitle>
          <CardDescription>View and manage all vehicles and their service history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search vehicles by make, model, or plate..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.vin}</TableCell>
                    <TableCell>{vehicle.owner}</TableCell>
                    <TableCell>{vehicle.lastService}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/vehicles/${vehicle.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
