import React, { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "../componets/Home/SearchBar/Serchbar";
import CategoryFilter from "../componets/Home/Category/categoryFilter";
import WorkerCard from "../componets/Home/WorkerCard/WorkerCard";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const dummyWorkers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    category: "Electrician",
    subCategory: "Fan Repair",
    image: "/images/worker1.jpg",
    rating: 4.3,
    Location: "Amravati",
  },
  {
    id: 2,
    name: "Sunil Mehta",
    category: "Plumber",
    subCategory: "Tap Fixing",
    image: "/images/worker2.jpg",
    rating: 3.3,
    Location: "Amravati",
  },
  {
    id: 3,
    name: "Anil Sharma",
    category: "Carpenter",
    subCategory: "Table Repair",
    image: "/images/worker3.jpg",
    rating: 5,
    Location: "Pune",
  },
  {
    id: 4,
    name: "Pooja Verma",
    category: "Electrician",
    subCategory: "Wiring",
    image: "/images/worker4.jpg",
    rating: 4.3,
    Location: "Amravati",
  },
  {
    id: 5,
    name: "Suresh Singh",
    category: "Plumber",
    subCategory: "Pipe Setup",
    image: "/images/worker5.jpg",
    rating: 4.1,
    Location: "warud",
  },
  {
    id: 6,
    name: "Alok Pandey",
    category: "Painter",
    subCategory: "Wall Painting",
    image: "/images/worker6.jpg",
    rating: 3.9,
    Location: "vashim",
  },
  {
    id: 7,
    name: "Meena Patil",
    category: "Electrician",
    subCategory: "AC Installation",
    image: "/images/worker7.jpg",
    rating: 4.3,
    Location: "Amravati",
  },
  {
    id: 8,
    name: "Tarun Yadav",
    category: "Carpenter",
    subCategory: "Door Fixing",
    image: "/images/worker8.jpg",
    rating: 4,
    Location: "Amravati",
  },
  {
    id: 9,
    name: "Nidhi Chauhan",
    category: "Plumber",
    subCategory: "Shower Setup",
    image: "/images/worker9.jpg",
    rating: 4.3,
    Location: "Nagpur",
  },
  {
    id: 10,
    name: "Ramesh Tiwari",
    category: "Painter",
    subCategory: "Interior Painting",
    image: "/images/worker10.jpg",
    rating: 4.7,
    Location: "Amravati",
  },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredWorkers =
    selectedCategory === "All"
      ? dummyWorkers
      : dummyWorkers.filter((w) => w.category === selectedCategory);

  const [workers, setWorkers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/workers/nearby", {
        params: {
          longitude: userLocation.lng,
          latitude: userLocation.lat,
          page,
          limit: 20,
        },
      });

      const newWorkers = res.data.workers;

      if (newWorkers.length < 20) setHasMore(false);

      setWorkers((prev) => [...prev, ...newWorkers]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load workers:", err);
      setHasMore(false);
    }
  };

  // useEffect(() => {
  //   fetchWorkers(); // initial load
  // }, []);

  return (
    <div className="home-container ">
      <div className="Seach-Category">
        <SearchBar />
        <div className="category-filter">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      <div className="home-layout">
        {/* <InfiniteScroll
          dataLength={workers.length}
          next={fetchWorkers}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >

        </InfiniteScroll> */}

        <div className="worker-list">
          {filteredWorkers.map((worker, index) => (
            <NavLink
              key={worker.id}
              to="/sendRequest"
              state={{ worker }}
              style={{ textDecoration: "none" }}
              className={"cursor-pointer"}
            >
              <WorkerCard key={worker.id} worker={worker} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
