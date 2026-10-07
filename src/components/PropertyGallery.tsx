import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import entry6079 from "../imports/_M0A6079.webp";
import living6140 from "../imports/_M0A6140.webp";
import living6145 from "../imports/_M0A6145.webp";
import living6149 from "../imports/_M0A6149.webp";
import living6154 from "../imports/_M0A6154.webp";
import kitchen6179 from "../imports/_M0A6179.webp";
import kitchen6184 from "../imports/_M0A6184.webp";
import kitchen6189 from "../imports/_M0A6189.webp";
import kitchen6129 from "../imports/_M0A6129.webp";
import kitchen6134 from "../imports/_M0A6134.webp";
import dining6084 from "../imports/_M0A6084.webp";
import dining6094 from "../imports/_M0A6094.webp";
import balcony6175 from "../imports/_M0A6175.webp";
import balcony6159 from "../imports/_M0A6159.webp";
import balcony6165 from "../imports/_M0A6165.webp";
import balcony6169 from "../imports/_M0A6169.webp";
import primaryBedroom6099 from "../imports/_M0A6099.webp";
import primaryBedroom6104 from "../imports/_M0A6104.webp";
import primaryBedroom6109 from "../imports/_M0A6109.webp";
import primaryBedroom6124 from "../imports/_M0A6124.webp";
import primaryBathroom6114 from "../imports/_M0A6114.webp";
import primaryBathroom6119 from "../imports/_M0A6119.webp";
import secondBedroom6194 from "../imports/_M0A6194.webp";
import secondBedroom6199 from "../imports/_M0A6199.webp";
import secondBedroom6204 from "../imports/_M0A6204.webp";
import secondBedroom6209 from "../imports/_M0A6209.webp";
import secondBathroom6214 from "../imports/_M0A6214.webp";
import secondBathroom6219 from "../imports/_M0A6219.webp";
import loft6225 from "../imports/_M0A6225.webp";
import loft6234 from "../imports/_M0A6234.webp";
import loft6229 from "../imports/_M0A6229.webp";
import loft6239 from "../imports/_M0A6239.webp";
import loft6249 from "../imports/_M0A6249.webp";
import loft6244 from "../imports/_M0A6244.webp";
import loft6254 from "../imports/_M0A6254.webp";
import laundry6259 from "../imports/_M0A6259.webp";
import garage6264 from "../imports/_M0A6264.webp";

type GalleryPhoto = {
  filename: string;
  src?: string;
};

type GalleryRoom = {
  name: string;
  photos: GalleryPhoto[];
};

// Keep every room and filename here in final display order. Later batches only
// need their imported src added to the matching photo.
export const SACRAMENTO_PHOTO_ROOMS: GalleryRoom[] = [
  { name: "Entry", photos: [{ filename: "_M0A6079.jpg", src: entry6079 }] },
  {
    name: "Living room",
    photos: [
      { filename: "_M0A6140.jpg", src: living6140 },
      { filename: "_M0A6145.jpg", src: living6145 },
      { filename: "_M0A6149.jpg", src: living6149 },
      { filename: "_M0A6154.jpg", src: living6154 },
    ],
  },
  {
    name: "Kitchen",
    photos: [
      { filename: "_M0A6179.jpg", src: kitchen6179 },
      { filename: "_M0A6184.jpg", src: kitchen6184 },
      { filename: "_M0A6189.jpg", src: kitchen6189 },
      { filename: "_M0A6129.jpg", src: kitchen6129 },
      { filename: "_M0A6134.jpg", src: kitchen6134 },
    ],
  },
  {
    name: "Dining",
    photos: [
      { filename: "_M0A6084.jpg", src: dining6084 },
      { filename: "_M0A6094.jpg", src: dining6094 },
    ],
  },
  {
    name: "Balcony",
    photos: [
      { filename: "_M0A6175.jpg", src: balcony6175 },
      { filename: "_M0A6159.jpg", src: balcony6159 },
      { filename: "_M0A6165.jpg", src: balcony6165 },
      { filename: "_M0A6169.jpg", src: balcony6169 },
    ],
  },
  {
    name: "Primary bedroom",
    photos: [
      { filename: "_M0A6099.jpg", src: primaryBedroom6099 },
      { filename: "_M0A6104.jpg", src: primaryBedroom6104 },
      { filename: "_M0A6109.jpg", src: primaryBedroom6109 },
      { filename: "_M0A6124.jpg", src: primaryBedroom6124 },
    ],
  },
  {
    name: "Primary bathroom",
    photos: [
      { filename: "_M0A6114.jpg", src: primaryBathroom6114 },
      { filename: "_M0A6119.jpg", src: primaryBathroom6119 },
    ],
  },
  {
    name: "Second bedroom",
    photos: [
      { filename: "_M0A6194.jpg", src: secondBedroom6194 },
      { filename: "_M0A6199.jpg", src: secondBedroom6199 },
      { filename: "_M0A6204.jpg", src: secondBedroom6204 },
      { filename: "_M0A6209.jpg", src: secondBedroom6209 },
    ],
  },
  {
    name: "Second bathroom",
    photos: [
      { filename: "_M0A6214.jpg", src: secondBathroom6214 },
      { filename: "_M0A6219.jpg", src: secondBathroom6219 },
    ],
  },
  {
    name: "Loft",
    photos: [
      { filename: "_M0A6225.jpg", src: loft6225 },
      { filename: "_M0A6234.jpg", src: loft6234 },
      { filename: "_M0A6229.jpg", src: loft6229 },
      { filename: "_M0A6239.jpg", src: loft6239 },
      { filename: "_M0A6249.jpg", src: loft6249 },
      { filename: "_M0A6244.jpg", src: loft6244 },
      { filename: "_M0A6254.jpg", src: loft6254 },
    ],
  },
  { name: "Laundry", photos: [{ filename: "_M0A6259.jpg", src: laundry6259 }] },
  { name: "Garage", photos: [{ filename: "_M0A6264.jpg", src: garage6264 }] },
];

type AvailablePhoto = {
  filename: string;
  src: string;
  room: string;
  roomPhotoNumber: number;
};

function getAvailablePhotos() {
  return SACRAMENTO_PHOTO_ROOMS.flatMap((room) =>
    room.photos.flatMap((photo, index) =>
      photo.src
        ? [{
            filename: photo.filename,
            src: photo.src,
            room: room.name,
            roomPhotoNumber: index + 1,
          }]
        : [],
    ),
  );
}

function photoAlt(photo: AvailablePhoto) {
  return `${photo.room} at The Sacramento Condo, photo ${photo.roomPhotoNumber}.`;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableSelector =
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

function ViewerArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Previous photo" : "Next photo"}
      onClick={onClick}
      data-focus-photo
      className={`group absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full ${
        direction === "left" ? "left-2 md:left-4" : "right-2 md:right-4"
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-transform group-hover:scale-105 md:h-11 md:w-11">
        <Chevron direction={direction} />
      </span>
    </button>
  );
}

function DownChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type AvailableRoom = GalleryRoom & {
  availablePhotos: AvailablePhoto[];
};

function RoomNavigatorList({
  rooms,
  activeRoom,
  onSelect,
}: {
  rooms: AvailableRoom[];
  activeRoom: string;
  onSelect: (roomName: string) => void;
}) {
  return (
    <div className="space-y-1">
      {rooms.map((room) => {
        const count = room.availablePhotos.length;
        const active = room.name === activeRoom;
        return (
          <button
            key={room.name}
            type="button"
            onClick={() => onSelect(room.name)}
            aria-current={active ? "location" : undefined}
            className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors ${
              active ? "bg-sage" : "hover:bg-cream"
            }`}
          >
            <img width={2000} height={1333}
              src={room.availablePhotos[0].src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-12 w-12 flex-none rounded-lg object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{room.name}</span>
              <span
                className={`mt-0.5 block text-sm ${
                  active ? "text-ink/80" : "text-muted"
                }`}
              >
                {count} {count === 1 ? "photo" : "photos"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function PropertyGallery() {
  const availablePhotos = useMemo(getAvailablePhotos, []);
  const availableRooms = useMemo(
    () =>
      SACRAMENTO_PHOTO_ROOMS.map((room) => ({
        ...room,
        availablePhotos: availablePhotos.filter((photo) => photo.room === room.name),
      })).filter((room) => room.availablePhotos.length > 0),
    [availablePhotos],
  );
  const photosByFilename = useMemo(
    () => new Map(availablePhotos.map((photo) => [photo.filename, photo])),
    [availablePhotos],
  );

  const previewPhotos = [
    photosByFilename.get("_M0A6140.jpg")!,
    photosByFilename.get("_M0A6179.jpg")!,
    photosByFilename.get("_M0A6099.jpg") ?? photosByFilename.get("_M0A6145.jpg")!,
    photosByFilename.get("_M0A6234.jpg") ?? photosByFilename.get("_M0A6149.jpg")!,
    photosByFilename.get("_M0A6175.jpg") ?? photosByFilename.get("_M0A6154.jpg")!,
  ];
  const mobilePhotos = [
    ...previewPhotos,
    ...availablePhotos.filter(
      (photo) => !previewPhotos.some((preview) => preview.filename === photo.filename),
    ),
  ];

  const [tourOpen, setTourOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [activeRoom, setActiveRoom] = useState(availableRooms[0].name);
  const [roomsSheetOpen, setRoomsSheetOpen] = useState(false);
  const showAllButtonRef = useRef<HTMLButtonElement>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const roomsSheetRef = useRef<HTMLDivElement>(null);
  const roomsButtonRef = useRef<HTMLButtonElement>(null);
  const viewerTriggerRef = useRef<HTMLElement | null>(null);
  const tourTriggerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Inert is released before focus moves back, because inert elements cannot take focus.
  const closeTour = () => {
    document.getElementById("root")?.removeAttribute("inert");
    setRoomsSheetOpen(false);
    setTourOpen(false);
    (tourTriggerRef.current ?? showAllButtonRef.current)?.focus();
  };
  const closeViewer = () => {
    tourRef.current?.removeAttribute("inert");
    setViewerIndex(null);
    viewerTriggerRef.current?.focus();
  };
  const closeRoomsSheet = () => {
    tourRef.current?.removeAttribute("inert");
    setRoomsSheetOpen(false);
    roomsButtonRef.current?.focus();
  };

  // The page behind the photo tour is inert while it is open.
  useEffect(() => {
    const root = document.getElementById("root");
    if (!tourOpen || !root) return;
    root.setAttribute("inert", "");
    return () => root.removeAttribute("inert");
  }, [tourOpen]);

  // The photo tour is inert while the viewer or the rooms sheet sits on top of it.
  const topLayerOpen = viewerIndex !== null || roomsSheetOpen;
  useEffect(() => {
    const tour = tourRef.current;
    if (!topLayerOpen || !tour) return;
    tour.setAttribute("inert", "");
    return () => tour.removeAttribute("inert");
  }, [topLayerOpen]);

  useFocusTrap(tourOpen && viewerIndex === null && !roomsSheetOpen, tourRef, closeTour);
  useFocusTrap(roomsSheetOpen, roomsSheetRef, closeRoomsSheet);
  useFocusTrap(viewerIndex !== null, viewerRef, closeViewer);

  useEffect(() => {
    if (!tourOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [tourOpen]);

  useEffect(() => {
    if (!tourOpen) return;
    const tour = tourRef.current;
    if (!tour) return;

    let frame = 0;
    const updateActiveRoom = () => {
      if (tour.scrollTop + tour.clientHeight >= tour.scrollHeight - 4) {
        setActiveRoom(availableRooms[availableRooms.length - 1].name);
        return;
      }

      const marker = tour.getBoundingClientRect().top + (window.innerWidth < 1280 ? 160 : 112);
      let currentRoom = availableRooms[0].name;
      for (const room of availableRooms) {
        const section = document.getElementById(
          `gallery-${room.name.toLowerCase().replace(/ /g, "-")}`,
        );
        if (section && section.getBoundingClientRect().top <= marker) {
          currentRoom = room.name;
        }
      }
      setActiveRoom(currentRoom);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveRoom);
    };

    tour.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActiveRoom();
    return () => {
      tour.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [tourOpen, availableRooms]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setViewerIndex((current) =>
          current === null ? null : (current - 1 + availablePhotos.length) % availablePhotos.length,
        );
      } else if (event.key === "ArrowRight") {
        setViewerIndex((current) =>
          current === null ? null : (current + 1) % availablePhotos.length,
        );
      }
    };
    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [viewerIndex, availablePhotos.length]);

  const openTour = (event: { currentTarget: HTMLElement }) => {
    tourTriggerRef.current = event.currentTarget;
    setTourOpen(true);
  };
  const scrollToRoom = (roomName: string) => {
    document
      .getElementById(`gallery-${roomName.toLowerCase().replace(/ /g, "-")}`)
      ?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  const selectRoomFromSheet = (roomName: string) => {
    tourRef.current?.removeAttribute("inert");
    setRoomsSheetOpen(false);
    roomsButtonRef.current?.focus({ preventScroll: true });
    requestAnimationFrame(() => scrollToRoom(roomName));
  };
  const openViewer = (photo: AvailablePhoto, trigger: HTMLElement) => {
    viewerTriggerRef.current = trigger;
    setViewerIndex(availablePhotos.findIndex((item) => item.filename === photo.filename));
  };
  const moveViewer = (direction: number) => {
    setViewerIndex((current) =>
      current === null
        ? null
        : (current + direction + availablePhotos.length) % availablePhotos.length,
    );
  };

  return (
    <>
      <div className="relative">
        <div
          className="relative overflow-hidden rounded-2xl md:grid md:aspect-16/9 md:grid-cols-2 md:gap-3 xl:aspect-auto xl:h-128"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(distance) > 40) {
              setMobileIndex((current) =>
                (current + (distance < 0 ? 1 : -1) + mobilePhotos.length) %
                mobilePhotos.length,
              );
            }
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={openTour}
            aria-label={`Open photo tour from ${photoAlt(mobilePhotos[mobileIndex])}`}
            className="relative block aspect-4/3 w-full overflow-hidden md:hidden"
          >
            <img width={2000} height={1333}
              src={mobilePhotos[mobileIndex].src}
              alt={photoAlt(mobilePhotos[mobileIndex])}
              loading={previewPhotos.includes(mobilePhotos[mobileIndex]) ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1.5 text-sm font-medium text-white">
              {mobileIndex + 1} / {availablePhotos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={openTour}
            className="hidden h-full overflow-hidden md:block"
            aria-label={`Open photo tour from ${photoAlt(previewPhotos[0])}`}
          >
            <img width={2000} height={1333}
              src={previewPhotos[0].src}
              alt={photoAlt(previewPhotos[0])}
              className="h-full w-full object-cover"
            />
          </button>
          <div className="hidden h-full grid-rows-2 gap-3 md:grid xl:grid-cols-2">
            {previewPhotos.slice(1).map((photo, index) => (
              <button
                key={photo.filename}
                type="button"
                onClick={openTour}
                aria-label={`Open photo tour from ${photoAlt(photo)}`}
                className={`h-full overflow-hidden ${
                  index > 1 ? "hidden xl:block" : ""
                }`}
              >
                <img width={2000} height={1333} src={photo.src} alt={photoAlt(photo)} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <button
          ref={showAllButtonRef}
          type="button"
          onClick={openTour}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-md transition-opacity hover:opacity-90 md:absolute md:bottom-4 md:right-4 md:mt-0 md:w-auto"
        >
          Show all {availablePhotos.length} photos
        </button>
      </div>

      {tourOpen && createPortal(
        <div
          ref={tourRef}
          role="dialog"
          aria-modal="true"
          aria-label="The Sacramento Condo photo tour"
          className="fixed inset-0 z-50 overflow-y-auto bg-white"
        >
          <header className="sticky top-0 z-20 border-b border-ink/10 bg-white">
            <div className="mx-auto flex max-w-[1280px] items-center px-5 py-4 md:px-10">
              <button
                type="button"
                onClick={closeTour}
                aria-label="Close photo tour"
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-cream"
              >
                <CloseIcon />
              </button>
              <p className="ml-4 text-sm font-semibold text-ink">
                The Sacramento Condo, {availablePhotos.length} photos
              </p>
            </div>
          </header>

          <div className="sticky top-19 z-10 border-b border-ink/10 bg-white xl:hidden">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 md:px-10">
              <p className="truncate text-sm font-semibold text-ink">
                {activeRoom}, {availableRooms.findIndex((room) => room.name === activeRoom) + 1} of{" "}
                {availableRooms.length}
              </p>
              <button
                ref={roomsButtonRef}
                type="button"
                onClick={() => setRoomsSheetOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={roomsSheetOpen}
                className="flex min-h-11 flex-none items-center gap-2 rounded-full border border-ink/20 px-4 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                All rooms
                <DownChevron />
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-[1280px] px-5 md:px-10 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-10">
            <aside className="hidden py-14 xl:block">
              <nav
                aria-label="Photo tour rooms"
                className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
              >
                <RoomNavigatorList
                  rooms={availableRooms}
                  activeRoom={activeRoom}
                  onSelect={scrollToRoom}
                />
              </nav>
            </aside>

            <div className="py-10 md:py-14">
              {availableRooms.map((room, roomIndex) => (
                <section
                  key={room.name}
                  id={`gallery-${room.name.toLowerCase().replace(/ /g, "-")}`}
                  className={`scroll-mt-40 xl:scroll-mt-24 ${
                    roomIndex > 0 ? "mt-14 md:mt-20" : ""
                  }`}
                >
                  <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                    {room.name}
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {room.availablePhotos.map((photo, photoIndex) => {
                      const isOddTotal = room.availablePhotos.length % 2 === 1;
                      const isLastPhoto = photoIndex === room.availablePhotos.length - 1;
                      const spansBothCols = isOddTotal && isLastPhoto;

                      return (
                        <button
                          key={photo.filename}
                          type="button"
                          onClick={(event) => openViewer(photo, event.currentTarget)}
                          className={`overflow-hidden rounded-2xl text-left ${
                            spansBothCols ? "md:col-span-2" : ""
                          }`}
                          aria-label={`View ${photoAlt(photo)}`}
                        >
                          <img width={2000} height={1333}
                            src={photo.src}
                            alt={photoAlt(photo)}
                            loading="lazy"
                            decoding="async"
                            className={`w-full ${
                              spansBothCols
                                ? "h-auto md:aspect-16/9 md:object-cover"
                                : "h-auto"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {roomsSheetOpen && (
            <div
              className="fixed inset-0 z-30 flex items-end bg-ink/50 xl:hidden"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeRoomsSheet();
              }}
            >
              <div
                ref={roomsSheetRef}
                role="dialog"
                aria-modal="true"
                aria-label="All rooms"
                className="flex max-h-[80vh] w-full flex-col rounded-t-2xl bg-white"
                onTouchStart={(event) => {
                  touchStartY.current = event.touches[0].clientY;
                }}
                onTouchEnd={(event) => {
                  if (touchStartY.current === null) return;
                  const distance = event.changedTouches[0].clientY - touchStartY.current;
                  if (distance > 60) closeRoomsSheet();
                  touchStartY.current = null;
                }}
              >
                <div className="flex items-center border-b border-ink/10 px-5 py-4">
                  <h2 className="text-lg font-semibold text-ink">All rooms</h2>
                  <button
                    type="button"
                    onClick={closeRoomsSheet}
                    aria-label="Close room list"
                    className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-cream"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <nav aria-label="Photo tour rooms" className="overflow-y-auto p-3">
                  <RoomNavigatorList
                    rooms={availableRooms}
                    activeRoom={activeRoom}
                    onSelect={selectRoomFromSheet}
                  />
                </nav>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {viewerIndex !== null && createPortal(
        <div
          ref={viewerRef}
          data-focus-light
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo viewer"
          className="fixed inset-0 z-60 flex flex-col bg-ink text-white"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(distance) > 40) moveViewer(distance < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <header className="relative z-20 flex items-center px-5 py-4 md:px-10">
            <div>
              <p aria-hidden="true" className="text-sm font-semibold">
                {viewerIndex + 1} / {availablePhotos.length}
              </p>
              <p aria-live="polite" aria-atomic="true" className="sr-only">
                {viewerIndex + 1} of {availablePhotos.length}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {availablePhotos[viewerIndex].room}
              </p>
            </div>
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close full screen photo viewer"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 pb-5 md:px-20 md:pb-10">
            <img width={2000} height={1333}
              src={availablePhotos[viewerIndex].src}
              alt={photoAlt(availablePhotos[viewerIndex])}
              className="max-h-full max-w-full object-contain"
            />
            <ViewerArrow direction="left" onClick={() => moveViewer(-1)} />
            <ViewerArrow direction="right" onClick={() => moveViewer(1)} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
