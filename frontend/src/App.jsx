import { useState, useEffect } from "react";
import API from "./api";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

function App() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    date: "",
    time: "",
  });

  // 🔹 Fetch products from backend
  const fetchProducts = async () => {
    const res = await API.get("/products");
    setItems(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setForm({ name: "", price: "", quantity: "", date: "", time: "" });
    setEditItem(null);
    setOpen(false);
  };

  // 🔹 Save data (Create or Update)
  const handleSave = async () => {
    const { name, price, quantity, date, time } = form;
    if (!name || !price || !quantity || !date || !time) {
      alert("All fields are required");
      return;
    }

    if (editItem) {
      // Update
      const res = await API.put(`/products/${editItem.id}`, form);
      setItems(items.map((p) => (p.id === editItem.id ? res.data : p)));
    } else {
      // Create
      const res = await API.post("/products", form);
      setItems([...items, res.data]);
    }

    handleClose();
  };

  // 🔹 Edit Product
  const handleEdit = (item) => {
    setForm(item);
    setEditItem(item);
    setOpen(true);
  };

  // 🔹 Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await API.delete(`/products/${id}`);
      setItems(items.filter((p) => p.id !== id));
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Responsive Product CRUD
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{ borderRadius: "8px" }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Table */}
      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Time</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editItem ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editItem ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
