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
