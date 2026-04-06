import { Arena } from "../model/index.js";

export const getArenas = async (req, res) => {
  try {
    const arenas = await Arena.findAll();
    res.status(200).json(arenas);
  } catch (error) {
    console.error("Error fetching arenas:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createArena = async (req, res) => {
  try {
    const { name, location, rating, price, image } = req.body;
    const newArena = await Arena.create({
      name,
      location,
      rating: rating || 0,
      price,
      image
    });
    res.status(201).json(newArena);
  } catch (error) {
    console.error("Error creating arena:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArena = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, rating, price, image } = req.body;
    const arena = await Arena.findByPk(id);
    if (!arena) return res.status(404).json({ message: "Arena not found" });

    await arena.update({
      name,
      location,
      rating,
      price,
      image
    });
    res.status(200).json(arena);
  } catch (error) {
    console.error("Error updating arena:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArena = async (req, res) => {
  try {
    const { id } = req.params;
    const arena = await Arena.findByPk(id);
    if (!arena) return res.status(404).json({ message: "Arena not found" });

    await arena.destroy();
    res.status(200).json({ message: "Arena deleted successfully" });
  } catch (error) {
    console.error("Error deleting arena:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
