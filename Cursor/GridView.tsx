import { useEffect, useState, useRef } from "react";
import data from "@/data/data_new.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FilterIcon from "../assets/FilterIcon";
import SortIcon from "../assets/SortIcon";

interface Course {
  id: number;
  name: string;
  description: string;
  department: string;
  credits: number;
  level: string;
  img: string;
  cs1: boolean;
  cs2: boolean;
  dsav: boolean;
  cds: boolean;
  hcd: boolean;
  cel: boolean;
}

const TAGS = ["cs1", "cs2", "dsav", "cds", "hcd", "cel"];
const LEVELS = ["100", "200", "300", "Short"];
const DEPARTMENTS = ["DCS"];
const CREDITS = [1, 0.5];

function ProgressRing({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  // Make SVG ring larger, but keep text size the same
  const radius = 66;
  const stroke = 16;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#8B1D20"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="1.75rem"
          fontWeight="bold"
          fill="#8B1D20"
        >
          {value}/{max}
        </text>
      </svg>
      <div className="text-center text-base mt-2 font-semibold">{label}</div>
    </div>
  );
}

export function GridView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  // Filter state
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [filterCredits, setFilterCredits] = useState<number | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  // State for which dropdown is open
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  // Progress Panel selection state
  const [progressType, setProgressType] = useState<"Major" | "Minor" | "GEC">(
    "Major"
  );

  // Progress max values by type
  const maxCreditsByType = { Major: 10, Minor: 6, GEC: 4 };
  const maxCredits = maxCreditsByType[progressType];
  const maxLevel300 = 2;
  const attributeKeys = ["dsav", "cds", "hcd", "cel"];
  const attributeCount = attributeKeys.length;

  useEffect(() => {
    setCourses(data as Course[]);
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Filtering logic
  const filteredCourses = courses.filter((course) => {
    // Search
    if (
      search &&
      !course.name.toLowerCase().includes(search.toLowerCase()) &&
      !course.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    // Tags: must match all selected tags
    if (filterTags.length > 0) {
      for (const tag of filterTags) {
        if (!(course as any)[tag]) return false;
      }
    }
    // Level
    if (filterLevel && course.level !== filterLevel) return false;
    // Credits
    if (filterCredits && course.credits !== filterCredits) return false;
    // Department
    if (filterDepartment && course.department !== filterDepartment)
      return false;
    return true;
  });

  // Sorting logic
  let sortedCourses: Course[] = [];
  function levelSortValue(level: string) {
    if (level === "100") return 1;
    if (level === "200") return 2;
    if (level === "300") return 3;
    if (level.toLowerCase().startsWith("short")) return 4;
    return 5;
  }
  let allSorted = [...filteredCourses];
  if (sortBy === "level-asc") {
    allSorted.sort((a, b) => levelSortValue(a.level) - levelSortValue(b.level));
  } else if (sortBy === "level-desc") {
    allSorted.sort((a, b) => levelSortValue(b.level) - levelSortValue(a.level));
  } else if (sortBy === "department") {
    allSorted.sort((a, b) => a.department.localeCompare(b.department));
  } else if (sortBy === "credits-asc") {
    allSorted.sort((a, b) => a.credits - b.credits);
  } else if (sortBy === "credits-desc") {
    allSorted.sort((a, b) => b.credits - a.credits);
  } else if (sortBy === "tag-group") {
    const tagOrder = ["cs1", "cs2", "cds", "cel", "dsav", "hcd"];
    function getTagIndex(course: Course) {
      for (let i = 0; i < tagOrder.length; i++) {
        if ((course as any)[tagOrder[i]]) return i;
      }
      return tagOrder.length;
    }
    allSorted.sort((a, b) => getTagIndex(a) - getTagIndex(b));
  }
  // Always move selected courses to the top, but keep their sort order
  const selectedSorted = allSorted.filter((c) => selected.includes(c.id));
  const unselectedSorted = allSorted.filter((c) => !selected.includes(c.id));
  sortedCourses = [...selectedSorted, ...unselectedSorted];

  // Tag rendering helper
  function renderTags(course: Course) {
    const tags = [
      course.cs1 && "CS1",
      course.cs2 && "CS2",
      course.dsav && "DSAV",
      course.cds && "CDS",
      course.hcd && "HCD",
      course.cel && "CEL",
    ].filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag) => (
          <span
            key={tag as string}
            className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  // Dropdown menu for filters
  function FilterDropdown() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    // Close on outside click
    useEffect(() => {
      function handleClick(event: MouseEvent) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          filterDropdownOpen
        ) {
          setFilterDropdownOpen(false);
        }
      }
      if (filterDropdownOpen) {
        document.addEventListener("mousedown", handleClick);
      } else {
        document.removeEventListener("mousedown", handleClick);
      }
      return () => document.removeEventListener("mousedown", handleClick);
    }, [filterDropdownOpen]);
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-haspopup="true"
          aria-expanded={filterDropdownOpen}
          aria-controls="filter-menu"
          onClick={() => {
            setFilterDropdownOpen((open: boolean) => !open);
            setSortDropdownOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              setFilterDropdownOpen(true);
              setSortDropdownOpen(false);
            }
          }}
          className="min-w-0 h-10 flex items-center gap-2 border rounded px-3 py-2 text-sm bg-white hover:bg-gray-50 font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-[#8B1D20]"
        >
          <FilterIcon className="w-5 h-5 mr-1" aria-hidden="true" />
          <span>Filter Courses</span>
          <svg
            className="ml-auto"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        {filterDropdownOpen && (
          <div
            id="filter-menu"
            role="menu"
            aria-label="Filter courses"
            className="absolute z-10 mt-2 w-64 rounded-md bg-white border shadow-lg p-4 flex flex-col gap-2"
          >
            <div className="font-semibold text-sm mb-1">Tags</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  role="menuitemcheckbox"
                  aria-checked={filterTags.includes(tag)}
                  tabIndex={0}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[#8B1D20] ${
                    filterTags.includes(tag)
                      ? "bg-[#8B1D20] text-white border-[#8B1D20]"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilterTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFilterTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }
                  }}
                  aria-label={tag.toUpperCase()}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="font-semibold text-sm mb-1">Level</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  role="menuitemradio"
                  aria-checked={filterLevel === level}
                  tabIndex={0}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[#8B1D20] ${
                    filterLevel === level
                      ? "bg-[#8B1D20] text-white border-[#8B1D20]"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilterLevel((prev) => (prev === level ? null : level))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFilterLevel((prev) => (prev === level ? null : level));
                    }
                  }}
                  aria-label={
                    level === "Short" ? "Short Term" : `${level} Level`
                  }
                >
                  {level === "Short" ? "Short Term" : `${level} Level`}
                </button>
              ))}
            </div>
            <div className="font-semibold text-sm mb-1">Credits</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {CREDITS.map((credit) => (
                <button
                  key={credit}
                  role="menuitemradio"
                  aria-checked={filterCredits === credit}
                  tabIndex={0}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[#8B1D20] ${
                    filterCredits === credit
                      ? "bg-[#8B1D20] text-white border-[#8B1D20]"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilterCredits((prev) =>
                      prev === credit ? null : credit
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFilterCredits((prev) =>
                        prev === credit ? null : credit
                      );
                    }
                  }}
                  aria-label={`${credit} Credit${credit > 1 ? "s" : ""}`}
                >
                  {credit} Credit{credit > 1 ? "s" : ""}
                </button>
              ))}
            </div>
            <div className="font-semibold text-sm mb-1">Department</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  role="menuitemradio"
                  aria-checked={filterDepartment === dept}
                  tabIndex={0}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[#8B1D20] ${
                    filterDepartment === dept
                      ? "bg-[#8B1D20] text-white border-[#8B1D20]"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setFilterDepartment((prev) => (prev === dept ? null : dept))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFilterDepartment((prev) =>
                        prev === dept ? null : dept
                      );
                    }
                  }}
                  aria-label={dept}
                >
                  {dept}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilterTags([]);
                setFilterLevel(null);
                setFilterCredits(null);
                setFilterDepartment(null);
              }}
              aria-label="Clear all filters"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Pills for active filters
  function FilterPills() {
    const pills = [];
    for (const tag of filterTags) {
      pills.push({
        label: `Tag: ${tag.toUpperCase()}`,
        onRemove: () => setFilterTags((prev) => prev.filter((t) => t !== tag)),
        color:
          "bg-[#4B164C] text-white border-[#4B164C] cursor-pointer hover:opacity-80",
      });
    }
    if (filterLevel) {
      pills.push({
        label: filterLevel === "Short" ? "Short Term" : `${filterLevel} Level`,
        onRemove: () => setFilterLevel(null),
        color:
          "bg-[#22532B] text-white border-[#22532B] cursor-pointer hover:opacity-80",
      });
    }
    if (filterCredits) {
      pills.push({
        label: `${filterCredits} Credit${filterCredits > 1 ? "s" : ""}`,
        onRemove: () => setFilterCredits(null),
        color:
          "bg-[#2B3A53] text-white border-[#2B3A53] cursor-pointer hover:opacity-80",
      });
    }
    if (filterDepartment) {
      pills.push({
        label: filterDepartment,
        onRemove: () => setFilterDepartment(null),
        color:
          "bg-[#533C22] text-white border-[#533C22] cursor-pointer hover:opacity-80",
      });
    }
    if (pills.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-4" aria-label="Active filters">
        {pills.map((pill) => (
          <button
            key={pill.label}
            className={`flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${pill.color} focus-visible:ring-2 focus-visible:ring-[#8B1D20]`}
            style={{ borderWidth: 2 }}
            onClick={pill.onRemove}
            tabIndex={0}
            aria-label={`Remove ${pill.label}`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    );
  }

  // Progress calculations (use all selected courses, not just filtered)
  const allSelectedCourses = courses.filter((c) => selected.includes(c.id));
  const totalCredits = allSelectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const level300Credits = allSelectedCourses.filter(
    (c) => c.level === "300"
  ).length;
  const selectedAttributes = attributeKeys.filter((attr) =>
    allSelectedCourses.some((c) => (c as any)[attr])
  ).length;

  // Add a custom SortDropdown component
  function SortDropdown({
    sortBy,
    setSortBy,
  }: {
    sortBy: string;
    setSortBy: (v: string) => void;
  }) {
    const [open] = [sortDropdownOpen];
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      function handleClick(event: MouseEvent) {
        if (
          ref.current &&
          !ref.current.contains(event.target as Node) &&
          open
        ) {
          setSortDropdownOpen(false);
        }
      }
      if (open) {
        document.addEventListener("mousedown", handleClick);
      } else {
        document.removeEventListener("mousedown", handleClick);
      }
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    const options = [
      { value: "level-asc", label: "Level: Ascending" },
      { value: "level-desc", label: "Level: Descending" },
      { value: "department", label: "Department" },
      { value: "credits-asc", label: "Credits: Ascending" },
      { value: "credits-desc", label: "Credits: Descending" },
      { value: "tag-group", label: "Tag" },
    ];
    const current = options.find((o) => o.value === sortBy) || options[0];
    return (
      <div className="relative inline-block text-left" ref={ref}>
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="sort-menu"
          className="flex items-center gap-2 border rounded px-3 py-2 min-w-0 h-10 text-sm bg-white hover:bg-gray-50 font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-[#8B1D20]"
          onClick={() => {
            setSortDropdownOpen((open: boolean) => !open);
            setFilterDropdownOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              setSortDropdownOpen(true);
              setFilterDropdownOpen(false);
            }
          }}
        >
          <SortIcon className="w-5 h-5 mr-1" aria-hidden="true" />
          <span>{current.label}</span>
          <svg
            className="ml-auto"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div
            id="sort-menu"
            role="menu"
            aria-label="Sort courses"
            className="absolute z-20 mt-2 w-full rounded-md bg-white border shadow-lg py-1"
          >
            {options.map((option) => (
              <button
                key={option.value}
                role="menuitemradio"
                aria-checked={sortBy === option.value}
                tabIndex={0}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#8B1D20] ${
                  option.value === sortBy ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setSortBy(option.value);
                  setSortDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSortBy(option.value);
                    setSortDropdownOpen(false);
                  }
                }}
                aria-label={option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Progress Panel: on mobile, appears above grid; on desktop, on right */}
      <div
        className="w-full lg:w-96 flex-shrink-0 bg-gray-50 rounded-xl border p-6 flex flex-col gap-8 lg:sticky lg:top-0 lg:self-start z-30 order-0 lg:order-1"
        aria-label="Progress panel"
      >
        <div className="mb-2">
          <div className="text-2xl font-bold mb-6 text-center">Progress</div>
          <div className="mb-6">
            <select
              className="w-full border rounded h-10 px-3 py-2 text-sm bg-white hover:bg-gray-50 font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-[#8B1D20] transition-all duration-200"
              value={progressType}
              onChange={(e) =>
                setProgressType(e.target.value as "Major" | "Minor" | "GEC")
              }
              aria-label="Select progress type"
              style={{ minWidth: 0 }}
            >
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
              <option value="GEC">GEC</option>
            </select>
          </div>
          <div className="flex flex-col gap-10 items-center justify-center min-h-[420px] transition-all duration-300">
            {/* Smooth fade transition for progress rings */}
            <div
              key={progressType}
              className="w-full flex flex-col gap-10 items-center justify-center transition-opacity duration-300 opacity-100 animate-fadein"
            >
              <ProgressRing
                value={totalCredits}
                max={maxCredits}
                label="Total Credits"
              />
              {progressType === "Major" && (
                <ProgressRing
                  value={level300Credits}
                  max={maxLevel300}
                  label="300-Level Credits"
                />
              )}
              {(progressType === "Major" || progressType === "Minor") && (
                <ProgressRing
                  value={selectedAttributes}
                  max={attributeCount}
                  label="Course Attributes"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 order-1 lg:order-0">
        <div className="flex flex-row items-center gap-6 mb-6">
          {/* Search bar */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="border rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#8B1D20]"
          />
          <FilterDropdown />
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        <FilterPills />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedCourses.map((course) => (
            <Card
              key={course.id}
              className={`relative h-full transition-shadow hover:shadow-lg border-2 flex flex-col justify-between ${
                selected.includes(course.id)
                  ? "border-[#8B1D20]"
                  : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {/* Always a square, consistent size */}
                  <span className="inline-block w-8 h-8 bg-gray-200 rounded mr-2 flex-shrink-0" />
                  <CardTitle
                    className="text-base font-bold leading-tight max-w-[180px] line-clamp-3"
                    title={course.name}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.name}
                  </CardTitle>
                </div>
                <CardDescription className="truncate text-xs">
                  {course.department} |{" "}
                  {course.level === "Short"
                    ? "Short Term"
                    : course.level + "-level"}{" "}
                  | {course.credits} credit{course.credits > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between">
                <div className="text-sm mb-2 line-clamp-4 min-h-[60px]">
                  {course.description}
                </div>
                <div className="flex-grow" />
                {/* Tags always at the bottom */}
                <div className="flex flex-col justify-end min-h-[40px]">
                  {renderTags(course)}
                </div>
                <div className="mt-4 flex justify-between items-end min-h-[40px]">
                  <span className="text-xs text-gray-500">
                    Course ID:{" "}
                    {course.level === "Short"
                      ? `s${String(course.id).replace(/^5/, "")}`
                      : course.id}
                  </span>
                  <Button
                    size="sm"
                    variant={
                      selected.includes(course.id) ? "default" : "outline"
                    }
                    className={`self-end transition-all duration-200 ease-in-out relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-[#8B1D20]`}
                    onClick={() =>
                      setSelected((prev) =>
                        prev.includes(course.id)
                          ? prev.filter((id) => id !== course.id)
                          : [...prev, course.id]
                      )
                    }
                    aria-pressed={selected.includes(course.id)}
                  >
                    <span
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-in-out ${
                        selected.includes(course.id)
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                      aria-hidden={selected.includes(course.id)}
                    >
                      Select
                    </span>
                    <span
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-in-out ${
                        selected.includes(course.id)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      aria-hidden={!selected.includes(course.id)}
                    >
                      Selected
                    </span>
                    <span className="invisible">Selected</span>{" "}
                    {/* for button sizing consistency */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
