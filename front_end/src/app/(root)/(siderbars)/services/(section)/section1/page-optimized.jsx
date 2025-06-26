// Optimized section data with lazy loading
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

// Lazy load heavy components
const FileUploadHook = dynamic(
  () => import("../../../../../../hooks/useFileUpload"),
  {
    ssr: false,
  }
);

// API import
import { api } from "../../../../../../services/api";

// Icons - load only what's needed
const Icons = {
  Umbrella: dynamic(
    () =>
      import("react-icons/io5").then((mod) => ({
        default: mod.IoUmbrellaOutline,
      })),
    { ssr: false }
  ),
  Lego: dynamic(
    () => import("react-icons/pi").then((mod) => ({ default: mod.PiLego })),
    { ssr: false }
  ),
  Hammer: dynamic(
    () => import("react-icons/tb").then((mod) => ({ default: mod.TbHammer })),
    { ssr: false }
  ),
  Student: dynamic(
    () => import("react-icons/pi").then((mod) => ({ default: mod.PiStudent })),
    { ssr: false }
  ),
  User: dynamic(
    () =>
      import("react-icons/fa").then((mod) => ({
        default: mod.FaRegUserCircle,
      })),
    { ssr: false }
  ),
  Tools: dynamic(
    () =>
      import("react-icons/ri").then((mod) => ({ default: mod.RiToolsFill })),
    { ssr: false }
  ),
};

// Move default data to separate file to reduce memory
const getDefaultSection1Data = () => ({
  title: "Capabilities",
  subtitle: "Taking care of the new products's launch and user support",
  categories: ["Prototypes", "Development", "Support", "Design"],
  mainText: "All you need is Enside, a modern & simple template",
  description:
    "We are the comprehensive design and technology partner for the digital age.",
  layoutSettings: {
    desktop: { categoriesPerRow: 4, statisticsPerRow: 3 },
    mobile: { categoriesPerRow: 2, statisticsPerRow: 1 },
  },
  statistics: {
    mainTitle: "We create human experience in a digital world",
    stats: [
      { number: "97", label: "Percent of users recommend us" },
      { number: "350", label: "Companies have shifted to using us recently" },
      { number: "35", label: "We deliver so much more than the competition" },
    ],
  },
  sections: {
    Prototypes: {
      title: "Prototypes",
      description: "Building innovative prototypes",
      icon: "Umbrella",
      color: "#3B82F6",
      features: ["Rapid prototyping", "User testing", "Concept validation"],
    },
    Development: {
      title: "Development",
      description: "Full-stack development services",
      icon: "Lego",
      color: "#10B981",
      features: ["Web applications", "Mobile apps", "API development"],
    },
    Support: {
      title: "Support",
      description: "24/7 customer support",
      icon: "Tools",
      color: "#F59E0B",
      features: ["Technical support", "Bug fixes", "Maintenance"],
    },
    Design: {
      title: "Design",
      description: "User-centered design approach",
      icon: "Student",
      color: "#EF4444",
      features: ["UI/UX design", "Branding", "Design systems"],
    },
  },
});

// Memoized components to prevent unnecessary re-renders
const CategoryCard = React.memo(
  ({ category, data, viewMode, colors, onEdit }) => {
    const IconComponent = Icons[data.icon];

    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          {IconComponent && (
            <IconComponent
              className="w-8 h-8 mr-3"
              style={{ color: data.color }}
            />
          )}
          <h3
            className="text-xl font-semibold"
            style={{ color: colors?.textColor }}
          >
            {data.title}
          </h3>
        </div>
        <p className="text-gray-600 mb-4">{data.description}</p>
        <ul className="space-y-1">
          {data.features?.map((feature, index) => (
            <li key={index} className="text-sm text-gray-500">
              • {feature}
            </li>
          ))}
        </ul>
        {onEdit && (
          <button
            onClick={() => onEdit(category)}
            className="mt-4 px-3 py-1 bg-blue-500 text-white text-sm rounded"
          >
            Edit
          </button>
        )}
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

const StatisticCard = React.memo(({ stat, colors }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md">
    <div
      className="text-4xl font-bold mb-2"
      style={{ color: colors?.primaryColor }}
    >
      {stat.number}
    </div>
    <p className="text-gray-600">{stat.label}</p>
  </div>
));

StatisticCard.displayName = "StatisticCard";

const Section1PageOptimized = () => {
  // Reduced state management
  const [state, setState] = useState({
    viewMode: "desktop",
    isClient: false,
    isLoading: true,
    isSaving: false,
    error: null,
    section1Data: null,
  });

  const router = useRouter();

  // Memoized data
  const section1Data = useMemo(
    () => state.section1Data || getDefaultSection1Data(),
    [state.section1Data]
  );

  // Memoized colors loading
  const loadGeneralInfoColors = useCallback(async () => {
    try {
      const result = await api.getSubsection("general-info", "main");
      return result.success && result.data?.data?.colors
        ? result.data.data.colors
        : null;
    } catch (error) {
      console.error("Error loading colors:", error);
      return null;
    }
  }, []);

  // Optimized data loading
  const loadData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [generalInfoColors, sectionResult] = await Promise.all([
        loadGeneralInfoColors(),
        api.getSubsection("services", "section1"),
      ]);

      if (sectionResult.success && sectionResult.data?.data) {
        setState((prev) => ({
          ...prev,
          section1Data: sectionResult.data.data,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, [loadGeneralInfoColors]);

  // Save data with optimistic updates
  const saveData = useCallback(async (newData) => {
    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      const result = await api.saveSection({
        sectionName: "services",
        subsectionName: "section1",
        title: "Service Capabilities",
        content: "Services section 1 content",
        data: newData,
      });

      if (result.success) {
        setState((prev) => ({
          ...prev,
          section1Data: newData,
          isSaving: false,
        }));
        toast.success("Saved successfully!");
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isSaving: false,
      }));
      toast.error("Save failed!");
    }
  }, []);

  // Client-side mounting
  useEffect(() => {
    setState((prev) => ({ ...prev, isClient: true }));
    loadData();
  }, [loadData]);

  // Memoized grid classes
  const gridClasses = useMemo(() => {
    const settings = section1Data.layoutSettings?.[state.viewMode] ||
      section1Data.layoutSettings?.desktop || {
        categoriesPerRow: 4,
        statisticsPerRow: 3,
      };

    return {
      categories: `grid-cols-1 md:grid-cols-${Math.min(
        settings.categoriesPerRow,
        4
      )}`,
      statistics: `grid-cols-1 md:grid-cols-${Math.min(
        settings.statisticsPerRow,
        3
      )}`,
    };
  }, [section1Data.layoutSettings, state.viewMode]);

  if (!state.isClient) return null;

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{section1Data.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{section1Data.subtitle}</p>
        <p className="text-lg text-gray-700">{section1Data.mainText}</p>
      </div>

      {/* Categories */}
      <div className={`grid ${gridClasses.categories} gap-6 mb-12`}>
        {section1Data.categories?.map((category) => {
          const categoryData = section1Data.sections?.[category];
          if (!categoryData) return null;

          return (
            <CategoryCard
              key={category}
              category={category}
              data={categoryData}
              viewMode={state.viewMode}
              colors={{}} // Load from general-info if needed
            />
          );
        })}
      </div>

      {/* Statistics */}
      {section1Data.statistics && (
        <div className="bg-gray-50 py-12 px-6 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-8">
            {section1Data.statistics.mainTitle}
          </h2>
          <div className={`grid ${gridClasses.statistics} gap-6`}>
            {section1Data.statistics.stats?.map((stat, index) => (
              <StatisticCard key={index} stat={stat} colors={{}} />
            ))}
          </div>
        </div>
      )}

      {/* Status indicator */}
      {state.isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Saving...
        </div>
      )}
    </div>
  );
};

export default React.memo(Section1PageOptimized);
