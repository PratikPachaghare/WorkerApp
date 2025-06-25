import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import SearchBar from "../componets/Home/SearchBar/Serchbar";
import CategoryFilter from "../componets/Home/Category/categoryFilter";
import WorkerCard from "../componets/Home/WorkerCard/WorkerCard";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../componets/Loder/Loader";

const LIMIT = 20;

const Home = () => {
  const [workersData, setWorkersData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1); // for pagination tracking

  const data = useSelector((state) => state.user.userData);

  const filteredWorkers =
    selectedCategory === "All"
      ? workersData
      : workersData.filter((w) => w.category === selectedCategory);

  // Load first page only after coordinates are ready
  useEffect(() => {
    const coords = data?.location?.coordinates;
    if (
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      console.log("✅ Coordinates available:", coords);
      setWorkersData([]);
      setHasMore(true);
      pageRef.current = 1;
      fetchWorkers(1);
    } else {
      console.warn("🚫 Missing or invalid coordinates:", coords);
    }
  }, [data]);

  const fetchWorkers = async (pageNumber) => {
    const longitude = data?.location?.coordinates?.[0];
    const latitude = data?.location?.coordinates?.[1];

    if (!longitude || !latitude) {
      console.warn("🚫 Skipping fetch, missing coordinates");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/workers/nearby", {
        params: {
          longitude,
          latitude,
          page: pageNumber,
          limit: LIMIT,
        },
      });

      const newWorkers = res.data.workers;

      if (newWorkers.length < LIMIT) {
        setHasMore(false);
      }

      // Avoid duplicates
      setWorkersData((prev) => {
        const existingIds = new Set(prev.map((w) => w._id));
        const uniqueNew = newWorkers.filter((w) => !existingIds.has(w._id));
        return [...prev, ...uniqueNew];
      });

      pageRef.current += 1;
    } catch (err) {
      console.error("❌ Failed to load workers:", err);
      setHasMore(false);
    }
  };

  return (
    <div className="home-container">
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
        <InfiniteScroll
          dataLength={workersData.length} // full list, not filtered
          next={() => fetchWorkers(pageRef.current)}
          hasMore={hasMore}
          loader={<h1 className="m-auto mt-2 text-2xl">Lodding....</h1>}
          endMessage={
            <p className="text-center py-2 text-gray-500">
              🎉 No more workers nearby.
            </p>
          }
        >
          <div className="worker-list">
            {filteredWorkers.map((worker) => (
              <NavLink
                key={worker._id}
                to="/sendRequest"
                state={{ worker,data}}
                style={{ textDecoration: "none" }}
                className="cursor-pointer"
              >
                <WorkerCard worker={worker} />
              </NavLink>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
