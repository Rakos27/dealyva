/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

import {
  brands as catalogBrands,
  categories as catalogCategories,
  promotions as catalogPromotions,
} from "../data/catalog";
import type {
  AdminPromotionDraft,
  AlertSettings,
  Brand,
  Category,
  CategoryId,
  DemoUser,
  Promotion,
  ToastMessage,
} from "../types";

export type Theme = "light" | "dark";
export type ToastTone = NonNullable<ToastMessage["tone"]>;

export interface LoginDetails {
  name: string;
  email: string;
}

export interface AddBrandInput {
  id?: string;
  name: string;
  category: CategoryId;
  initials: string;
  tone: string;
}

export type AddPromotionInput = AdminPromotionDraft | Promotion;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  promotionId?: string;
}

export interface AppContextValue {
  hydrated: boolean;
  hasHydrated: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  selectedBrands: string[];
  toggleBrand: (id: string) => void;
  setSelectedBrands: (ids: string[]) => void;
  clearBrands: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  recentlyViewed: string[];
  recordView: (id: string) => void;
  dismissedRecommendations: string[];
  dismissRecommendation: (id: string) => void;
  user: DemoUser | null;
  login: (details: LoginDetails) => DemoUser;
  logout: () => void;
  alerts: AlertSettings;
  updateAlerts: (updates: Partial<AlertSettings>) => void;
  promotions: Promotion[];
  setPromotions: Dispatch<SetStateAction<Promotion[]>>;
  addPromotion: (input: AddPromotionInput) => Promotion;
  updatePromotion: (
    id: string,
    updates: Partial<Promotion> | AdminPromotionDraft,
  ) => void;
  deletePromotion: (id: string) => void;
  expirePromotion: (id: string) => void;
  brands: Brand[];
  setBrands: Dispatch<SetStateAction<Brand[]>>;
  addBrand: (input: AddBrandInput) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  addCategory: (category: Category) => void;
  updateCategory: (id: CategoryId, updates: Partial<Category>) => void;
  deleteCategory: (id: CategoryId) => void;
  lastUpdated: string;
  isRefreshing: boolean;
  refreshOffers: () => Promise<void>;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  toasts: ToastMessage[];
  showToast: (
    message: string,
    tone?: ToastTone,
    duration?: number,
  ) => number;
  dismissToast: (id: number) => void;
  deleteAllData: () => void;
}

interface StoredAppState {
  theme: Theme;
  selectedBrands: string[];
  favorites: string[];
  recentlyViewed: string[];
  dismissedRecommendations: string[];
  user: DemoUser | null;
  alerts: AlertSettings;
  promotions: Promotion[];
  brands: Brand[];
  categories: Category[];
  lastUpdated: string;
  notifications: AppNotification[];
}

interface StorageEnvelope {
  version: number;
  state: StoredAppState;
}

const STORAGE_KEY = "offrely:app-state";
const STORAGE_VERSION = 1;
const MAX_RECENTLY_VIEWED = 20;
const MAX_NOTIFICATIONS = 30;
const DEFAULT_TOAST_DURATION = 3_600;

export const DEFAULT_ALERTS: AlertSettings = {
  favoriteBrand: true,
  discountThreshold: false,
  threshold: 30,
  priceDrop: false,
  expiringSoon: true,
  frequency: "daily",
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function clonePromotions(items: readonly Promotion[]): Promotion[] {
  return items.map((promotion) => ({
    ...promotion,
    tags: [...promotion.tags],
    terms: [...promotion.terms],
  }));
}

function getPreferredTheme(): Theme {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function createDefaultState(): StoredAppState {
  return {
    theme: getPreferredTheme(),
    selectedBrands: [],
    favorites: [],
    recentlyViewed: [],
    dismissedRecommendations: [],
    user: null,
    alerts: { ...DEFAULT_ALERTS },
    promotions: clonePromotions(catalogPromotions),
    brands: catalogBrands.map((brand) => ({ ...brand })),
    categories: catalogCategories.map((category) => ({ ...category })),
    lastUpdated: new Date().toISOString(),
    notifications: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    typeof value.eyebrow === "string" &&
    typeof value.image === "string" &&
    typeof value.accent === "string"
  );
}

function isBrand(value: unknown): value is Brand {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    typeof value.initials === "string" &&
    typeof value.tone === "string"
  );
}

function isPromotion(value: unknown): value is Promotion {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.brandId === "string" &&
    typeof value.brand === "string" &&
    typeof value.merchant === "string" &&
    typeof value.category === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.originalPrice === "number" &&
    Number.isFinite(value.originalPrice) &&
    typeof value.currentPrice === "number" &&
    Number.isFinite(value.currentPrice) &&
    typeof value.discount === "number" &&
    Number.isFinite(value.discount) &&
    typeof value.savings === "number" &&
    Number.isFinite(value.savings) &&
    typeof value.image === "string" &&
    typeof value.expiresAt === "string" &&
    typeof value.verifiedAt === "string" &&
    typeof value.createdAt === "string" &&
    (value.promoCode === undefined || typeof value.promoCode === "string") &&
    (value.isNew === undefined || typeof value.isNew === "boolean") &&
    (value.isExpired === undefined || typeof value.isExpired === "boolean") &&
    typeof value.onlineOnly === "boolean" &&
    isStringArray(value.terms) &&
    isStringArray(value.tags)
  );
}

function isDemoUser(value: unknown): value is DemoUser {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.initials === "string" &&
    typeof value.joinedAt === "string"
  );
}

function isNotification(value: unknown): value is AppNotification {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.message === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.read === "boolean" &&
    (value.promotionId === undefined ||
      typeof value.promotionId === "string")
  );
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function sanitizeAlerts(value: unknown): AlertSettings {
  if (!isRecord(value)) {
    return { ...DEFAULT_ALERTS };
  }

  const frequency =
    value.frequency === "instant" ||
    value.frequency === "daily" ||
    value.frequency === "weekly"
      ? value.frequency
      : DEFAULT_ALERTS.frequency;
  const rawThreshold =
    typeof value.threshold === "number" && Number.isFinite(value.threshold)
      ? value.threshold
      : DEFAULT_ALERTS.threshold;

  return {
    favoriteBrand:
      typeof value.favoriteBrand === "boolean"
        ? value.favoriteBrand
        : DEFAULT_ALERTS.favoriteBrand,
    discountThreshold:
      typeof value.discountThreshold === "boolean"
        ? value.discountThreshold
        : DEFAULT_ALERTS.discountThreshold,
    threshold: Math.min(100, Math.max(0, Math.round(rawThreshold))),
    priceDrop:
      typeof value.priceDrop === "boolean"
        ? value.priceDrop
        : DEFAULT_ALERTS.priceDrop,
    expiringSoon:
      typeof value.expiringSoon === "boolean"
        ? value.expiringSoon
        : DEFAULT_ALERTS.expiringSoon,
    frequency,
  };
}

function sanitizeStoredState(value: unknown): StoredAppState | null {
  if (!isRecord(value)) {
    return null;
  }

  const possibleState = isRecord(value.state) ? value.state : value;
  const fallback = createDefaultState();

  const brands =
    Array.isArray(possibleState.brands) &&
    possibleState.brands.every(isBrand)
      ? possibleState.brands.map((brand) => ({ ...brand }))
      : fallback.brands;
  const categories =
    Array.isArray(possibleState.categories) &&
    possibleState.categories.every(isCategory)
      ? possibleState.categories.map((category) => ({ ...category }))
      : fallback.categories;
  const promotions =
    Array.isArray(possibleState.promotions) &&
    possibleState.promotions.every(isPromotion)
      ? clonePromotions(possibleState.promotions)
      : fallback.promotions;
  const brandIds = new Set(brands.map((brand) => brand.id));
  const promotionIds = new Set(
    promotions.map((promotion) => promotion.id),
  );

  const selectedBrands = isStringArray(possibleState.selectedBrands)
    ? uniqueStrings(possibleState.selectedBrands).filter((id) =>
        brandIds.has(id),
      )
    : [];
  const favorites = isStringArray(possibleState.favorites)
    ? uniqueStrings(possibleState.favorites).filter((id) =>
        promotionIds.has(id),
      )
    : [];
  const recentlyViewed = isStringArray(possibleState.recentlyViewed)
    ? uniqueStrings(possibleState.recentlyViewed)
        .filter((id) => promotionIds.has(id))
        .slice(0, MAX_RECENTLY_VIEWED)
    : [];
  const dismissedRecommendations = isStringArray(
    possibleState.dismissedRecommendations,
  )
    ? uniqueStrings(possibleState.dismissedRecommendations)
    : [];
  const notifications = Array.isArray(possibleState.notifications)
    ? possibleState.notifications
        .filter(isNotification)
        .slice(0, MAX_NOTIFICATIONS)
    : [];

  return {
    theme:
      possibleState.theme === "dark" || possibleState.theme === "light"
        ? possibleState.theme
        : fallback.theme,
    selectedBrands,
    favorites,
    recentlyViewed,
    dismissedRecommendations,
    user: isDemoUser(possibleState.user) ? possibleState.user : null,
    alerts: sanitizeAlerts(possibleState.alerts),
    promotions,
    brands,
    categories,
    lastUpdated:
      typeof possibleState.lastUpdated === "string"
        ? possibleState.lastUpdated
        : fallback.lastUpdated,
    notifications,
  };
}

function readStoredState(): StoredAppState {
  const fallback = createDefaultState();

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return fallback;
    }

    return sanitizeStoredState(JSON.parse(rawValue)) ?? fallback;
  } catch {
    return fallback;
  }
}

function buildInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("fr-FR") ?? "")
    .join("");

  return initials || "OF";
}

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("fr-FR")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}

function makeUniqueId(base: string, usedIds: Set<string>): string {
  if (!usedIds.has(base)) {
    return base;
  }

  let suffix = 2;
  while (usedIds.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

function calculatePricing(originalPrice: number, currentPrice: number) {
  const safeOriginal = Math.max(0, originalPrice);
  const safeCurrent = Math.max(0, currentPrice);
  const savings = Math.max(0, safeOriginal - safeCurrent);
  const discount =
    safeOriginal > 0 ? Math.round((savings / safeOriginal) * 100) : 0;

  return {
    originalPrice: safeOriginal,
    currentPrice: safeCurrent,
    savings: Number(savings.toFixed(2)),
    discount,
  };
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StoredAppState>(readStoredState);
  const hydrated = true;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const refreshInProgress = useRef(false);
  const toastId = useRef(0);
  const toastTimers = useRef(new Map<number, number>());

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.classList.toggle("dark", state.theme === "dark");
    root.style.colorScheme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const envelope: StorageEnvelope = {
      version: STORAGE_VERSION,
      state,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    } catch {
      // A full or disabled localStorage must not prevent using the demo.
    }
  }, [hydrated, state]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      if (event.newValue === null) {
        setState(createDefaultState());
        return;
      }

      try {
        const nextState = sanitizeStoredState(JSON.parse(event.newValue));
        if (nextState) {
          setState(nextState);
        }
      } catch {
        // Ignore invalid writes from another tab.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      toastTimers.current.clear();
    },
    [],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (
      message: string,
      tone: ToastTone = "default",
      duration = DEFAULT_TOAST_DURATION,
    ) => {
      toastId.current += 1;
      const id = toastId.current;
      setToasts((current) => [
        ...current.slice(-3),
        { id, message, tone },
      ]);

      if (duration > 0) {
        const timer = window.setTimeout(
          () => dismissToast(id),
          Math.max(500, duration),
        );
        toastTimers.current.set(id, timer);
      }

      return id;
    },
    [dismissToast],
  );

  const setTheme = useCallback((theme: Theme) => {
    setState((current) => ({ ...current, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((current) => ({
      ...current,
      theme: current.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const setSelectedBrands = useCallback((ids: string[]) => {
    setState((current) => {
      const validIds = new Set(current.brands.map((brand) => brand.id));
      return {
        ...current,
        selectedBrands: uniqueStrings(ids).filter((id) =>
          validIds.has(id),
        ),
      };
    });
  }, []);

  const toggleBrand = useCallback((id: string) => {
    setState((current) => {
      if (!current.brands.some((brand) => brand.id === id)) {
        return current;
      }

      return {
        ...current,
        selectedBrands: current.selectedBrands.includes(id)
          ? current.selectedBrands.filter((brandId) => brandId !== id)
          : [...current.selectedBrands, id],
      };
    });
  }, []);

  const clearBrands = useCallback(() => {
    setState((current) => ({ ...current, selectedBrands: [] }));
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const isAdding = !state.favorites.includes(id);
      setState((current) => {
        if (!current.promotions.some((promotion) => promotion.id === id)) {
          return current;
        }

        return {
          ...current,
          favorites: current.favorites.includes(id)
            ? current.favorites.filter((promotionId) => promotionId !== id)
            : [id, ...current.favorites],
        };
      });
      showToast(
        isAdding ? "Offre ajoutée aux favoris" : "Offre retirée des favoris",
        isAdding ? "success" : "default",
      );
    },
    [showToast, state.favorites],
  );

  const recordView = useCallback((id: string) => {
    setState((current) => {
      if (!current.promotions.some((promotion) => promotion.id === id)) {
        return current;
      }

      return {
        ...current,
        recentlyViewed: [
          id,
          ...current.recentlyViewed.filter(
            (promotionId) => promotionId !== id,
          ),
        ].slice(0, MAX_RECENTLY_VIEWED),
      };
    });
  }, []);

  const dismissRecommendation = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      dismissedRecommendations: uniqueStrings([
        ...current.dismissedRecommendations,
        id,
      ]),
    }));
  }, []);

  const login = useCallback(
    (details: LoginDetails) => {
      const name = details.name.trim() || "Utilisateur Offrely";
      const user: DemoUser = {
        name,
        email: details.email.trim().toLocaleLowerCase("fr-FR"),
        initials: buildInitials(name),
        joinedAt: new Date().toISOString(),
      };
      setState((current) => ({ ...current, user }));
      showToast(`Bienvenue, ${name.split(/\s+/)[0]}`, "success");
      return user;
    },
    [showToast],
  );

  const logout = useCallback(() => {
    setState((current) => ({ ...current, user: null }));
    showToast("Vous êtes déconnecté");
  }, [showToast]);

  const updateAlerts = useCallback(
    (updates: Partial<AlertSettings>) => {
      setState((current) => ({
        ...current,
        alerts: sanitizeAlerts({ ...current.alerts, ...updates }),
      }));
      showToast("Préférences d’alerte enregistrées", "success");
    },
    [showToast],
  );

  const setPromotions: Dispatch<SetStateAction<Promotion[]>> = useCallback(
    (value) => {
      setState((current) => ({
        ...current,
        promotions:
          typeof value === "function"
            ? value(current.promotions)
            : value,
      }));
    },
    [],
  );

  const addPromotion = useCallback(
    (input: AddPromotionInput) => {
      const now = new Date().toISOString();
      const usedIds = new Set(
        state.promotions.map((promotion) => promotion.id),
      );
      const isCompletePromotion = isPromotion(input);
      const brandId = input.brandId;
      const brand =
        state.brands.find((item) => item.id === brandId)?.name ??
        (isCompletePromotion ? input.brand : brandId);

      let promotion: Promotion;
      if (isCompletePromotion) {
        promotion = {
          ...input,
          id: makeUniqueId(input.id, usedIds),
          brand,
          tags: [...input.tags],
          terms: [...input.terms],
        };
      } else {
        const pricing = calculatePricing(
          input.originalPrice,
          input.currentPrice,
        );
        const visual =
          state.promotions.find(
            (item) => item.category === input.category,
          )?.image ??
          state.promotions[0]?.image ??
          "";

        promotion = {
          id: makeUniqueId(
            `offre-${slugify(input.title)}-${Date.now()}`,
            usedIds,
          ),
          brandId,
          brand,
          merchant: input.merchant,
          category: input.category,
          title: input.title,
          description:
            "Promotion fictive ajoutée depuis l’administration de démonstration Offrely.",
          ...pricing,
          image: visual,
          expiresAt: input.expiresAt,
          verifiedAt: now,
          createdAt: now,
          promoCode: input.promoCode.trim() || undefined,
          isNew: true,
          isExpired: new Date(input.expiresAt).getTime() <= Date.now(),
          onlineOnly: true,
          terms: [
            "Données de démonstration, sans valeur commerciale.",
            "Disponibilité en ligne simulée.",
          ],
          tags: ["administration", "demonstration"],
        };
      }

      setState((current) => ({
        ...current,
        promotions: [promotion, ...current.promotions],
        lastUpdated: now,
      }));
      showToast("Promotion ajoutée", "success");
      return promotion;
    },
    [showToast, state.brands, state.promotions],
  );

  const updatePromotion = useCallback(
    (
      id: string,
      updates: Partial<Promotion> | AdminPromotionDraft,
    ) => {
      setState((current) => ({
        ...current,
        promotions: current.promotions.map((promotion) => {
          if (promotion.id !== id) {
            return promotion;
          }

          const merged = { ...promotion, ...updates };
          const pricing = calculatePricing(
            merged.originalPrice,
            merged.currentPrice,
          );
          const brand =
            current.brands.find((item) => item.id === merged.brandId)
              ?.name ?? merged.brand;

          return {
            ...merged,
            ...pricing,
            brand,
            promoCode: merged.promoCode?.trim() || undefined,
            verifiedAt: new Date().toISOString(),
            isExpired:
              merged.isExpired ||
              new Date(merged.expiresAt).getTime() <= Date.now(),
          };
        }),
        lastUpdated: new Date().toISOString(),
      }));
      showToast("Promotion mise à jour", "success");
    },
    [showToast],
  );

  const deletePromotion = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        promotions: current.promotions.filter(
          (promotion) => promotion.id !== id,
        ),
        favorites: current.favorites.filter(
          (promotionId) => promotionId !== id,
        ),
        recentlyViewed: current.recentlyViewed.filter(
          (promotionId) => promotionId !== id,
        ),
        dismissedRecommendations:
          current.dismissedRecommendations.filter(
            (promotionId) => promotionId !== id,
          ),
        notifications: current.notifications.filter(
          (notification) => notification.promotionId !== id,
        ),
        lastUpdated: new Date().toISOString(),
      }));
      showToast("Promotion supprimée", "danger");
    },
    [showToast],
  );

  const expirePromotion = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        promotions: current.promotions.map((promotion) =>
          promotion.id === id
            ? { ...promotion, isExpired: true }
            : promotion,
        ),
        lastUpdated: new Date().toISOString(),
      }));
      showToast("Promotion marquée comme expirée");
    },
    [showToast],
  );

  const setBrands: Dispatch<SetStateAction<Brand[]>> = useCallback(
    (value) => {
      setState((current) => ({
        ...current,
        brands:
          typeof value === "function" ? value(current.brands) : value,
      }));
    },
    [],
  );

  const addBrand = useCallback(
    (input: AddBrandInput) => {
      const usedIds = new Set(state.brands.map((brand) => brand.id));
      const brand: Brand = {
        ...input,
        id: makeUniqueId(
          slugify(input.id?.trim() || input.name),
          usedIds,
        ),
        name: input.name.trim(),
        initials: input.initials.trim() || buildInitials(input.name),
      };
      setState((current) => ({
        ...current,
        brands: [...current.brands, brand].sort((left, right) =>
          left.name.localeCompare(right.name, "fr"),
        ),
      }));
      showToast("Marque ajoutée", "success");
      return brand;
    },
    [showToast, state.brands],
  );

  const updateBrand = useCallback(
    (id: string, updates: Partial<Brand>) => {
      setState((current) => {
        const previous = current.brands.find((brand) => brand.id === id);
        if (!previous) {
          return current;
        }

        const nextBrand = { ...previous, ...updates, id };
        return {
          ...current,
          brands: current.brands
            .map((brand) => (brand.id === id ? nextBrand : brand))
            .sort((left, right) =>
              left.name.localeCompare(right.name, "fr"),
            ),
          promotions: current.promotions.map((promotion) =>
            promotion.brandId === id
              ? {
                  ...promotion,
                  brand: nextBrand.name,
                  category: nextBrand.category,
                }
              : promotion,
          ),
        };
      });
      showToast("Marque mise à jour", "success");
    },
    [showToast],
  );

  const deleteBrand = useCallback(
    (id: string) => {
      setState((current) => {
        const removedPromotionIds = new Set(
          current.promotions
            .filter((promotion) => promotion.brandId === id)
            .map((promotion) => promotion.id),
        );

        return {
          ...current,
          brands: current.brands.filter((brand) => brand.id !== id),
          selectedBrands: current.selectedBrands.filter(
            (brandId) => brandId !== id,
          ),
          promotions: current.promotions.filter(
            (promotion) => promotion.brandId !== id,
          ),
          favorites: current.favorites.filter(
            (promotionId) => !removedPromotionIds.has(promotionId),
          ),
          recentlyViewed: current.recentlyViewed.filter(
            (promotionId) => !removedPromotionIds.has(promotionId),
          ),
        };
      });
      showToast("Marque et offres associées supprimées", "danger");
    },
    [showToast],
  );

  const setCategories: Dispatch<SetStateAction<Category[]>> = useCallback(
    (value) => {
      setState((current) => ({
        ...current,
        categories:
          typeof value === "function"
            ? value(current.categories)
            : value,
      }));
    },
    [],
  );

  const addCategory = useCallback(
    (category: Category) => {
      setState((current) => {
        if (current.categories.some((item) => item.id === category.id)) {
          return current;
        }
        return {
          ...current,
          categories: [...current.categories, { ...category }],
        };
      });
      showToast("Catégorie ajoutée", "success");
    },
    [showToast],
  );

  const updateCategory = useCallback(
    (id: CategoryId, updates: Partial<Category>) => {
      setState((current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.id === id
            ? { ...category, ...updates, id }
            : category,
        ),
      }));
      showToast("Catégorie mise à jour", "success");
    },
    [showToast],
  );

  const deleteCategory = useCallback(
    (id: CategoryId) => {
      setState((current) => {
        const removedBrandIds = new Set(
          current.brands
            .filter((brand) => brand.category === id)
            .map((brand) => brand.id),
        );
        const removedPromotionIds = new Set(
          current.promotions
            .filter((promotion) => promotion.category === id)
            .map((promotion) => promotion.id),
        );

        return {
          ...current,
          categories: current.categories.filter(
            (category) => category.id !== id,
          ),
          brands: current.brands.filter(
            (brand) => brand.category !== id,
          ),
          promotions: current.promotions.filter(
            (promotion) => promotion.category !== id,
          ),
          selectedBrands: current.selectedBrands.filter(
            (brandId) => !removedBrandIds.has(brandId),
          ),
          favorites: current.favorites.filter(
            (promotionId) => !removedPromotionIds.has(promotionId),
          ),
          recentlyViewed: current.recentlyViewed.filter(
            (promotionId) => !removedPromotionIds.has(promotionId),
          ),
        };
      });
      showToast("Catégorie et données associées supprimées", "danger");
    },
    [showToast],
  );

  const refreshOffers = useCallback(async () => {
    if (refreshInProgress.current) {
      return;
    }

    refreshInProgress.current = true;
    setIsRefreshing(true);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 650);
      });

      const now = new Date();
      const nowIso = now.toISOString();
      const shouldCreateOffer = Math.random() < 0.6;
      let newOfferTitle = "";

      setState((current) => {
        const refreshed = current.promotions.map((promotion) => {
          const expiration = new Date(promotion.expiresAt).getTime();
          const created = new Date(promotion.createdAt).getTime();
          return {
            ...promotion,
            isExpired:
              promotion.isExpired ||
              (Number.isFinite(expiration) &&
                expiration <= now.getTime()),
            isNew:
              promotion.isNew &&
              Number.isFinite(created) &&
              now.getTime() - created < 72 * 60 * 60 * 1_000,
          };
        });

        const eligible = refreshed.filter(
          (promotion) => !promotion.isExpired,
        );
        const source =
          eligible[Math.floor(Math.random() * eligible.length)] ??
          catalogPromotions[0];

        if (!shouldCreateOffer || !source) {
          return {
            ...current,
            promotions: refreshed,
            lastUpdated: nowIso,
          };
        }

        const expiresAt = new Date(
          now.getTime() + (5 + Math.floor(Math.random() * 10)) * 86_400_000,
        ).toISOString();
        const promotion: Promotion = {
          ...source,
          id: `actualisation-${slugify(source.brand)}-${now.getTime()}`,
          title: source.title,
          tags: [...source.tags, "nouveaute"],
          terms: [...source.terms],
          createdAt: nowIso,
          verifiedAt: nowIso,
          expiresAt,
          isExpired: false,
          isNew: true,
        };
        newOfferTitle = promotion.title;
        const notification: AppNotification = {
          id: `notification-${promotion.id}`,
          title: `Nouvelle offre ${promotion.brand}`,
          message: promotion.title,
          createdAt: nowIso,
          read: false,
          promotionId: promotion.id,
        };

        return {
          ...current,
          promotions: [promotion, ...refreshed],
          notifications: [
            notification,
            ...current.notifications,
          ].slice(0, MAX_NOTIFICATIONS),
          lastUpdated: nowIso,
        };
      });

      showToast(
        newOfferTitle
          ? "Offres actualisées : une nouveauté a été ajoutée"
          : "Les offres sont à jour",
        "success",
      );
    } finally {
      refreshInProgress.current = false;
      setIsRefreshing(false);
    }
  }, [showToast]);

  const markNotificationRead = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState((current) => ({ ...current, notifications: [] }));
  }, []);

  const deleteAllData = useCallback(() => {
    try {
      for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
        const key = window.localStorage.key(index);
        if (key?.startsWith("offrely")) {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // The in-memory reset remains available if localStorage is disabled.
    }

    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current.clear();
    setToasts([]);
    setState(createDefaultState());
    showToast("Toutes vos données locales ont été supprimées", "success");
  }, [showToast]);

  const unreadNotificationsCount = useMemo(
    () =>
      state.notifications.reduce(
        (count, notification) => count + (notification.read ? 0 : 1),
        0,
      ),
    [state.notifications],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      hasHydrated: hydrated,
      theme: state.theme,
      setTheme,
      toggleTheme,
      selectedBrands: state.selectedBrands,
      toggleBrand,
      setSelectedBrands,
      clearBrands,
      favorites: state.favorites,
      toggleFavorite,
      recentlyViewed: state.recentlyViewed,
      recordView,
      dismissedRecommendations: state.dismissedRecommendations,
      dismissRecommendation,
      user: state.user,
      login,
      logout,
      alerts: state.alerts,
      updateAlerts,
      promotions: state.promotions,
      setPromotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
      expirePromotion,
      brands: state.brands,
      setBrands,
      addBrand,
      updateBrand,
      deleteBrand,
      categories: state.categories,
      setCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      lastUpdated: state.lastUpdated,
      isRefreshing,
      refreshOffers,
      notifications: state.notifications,
      unreadNotificationsCount,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      toasts,
      showToast,
      dismissToast,
      deleteAllData,
    }),
    [
      addBrand,
      addCategory,
      addPromotion,
      clearBrands,
      clearNotifications,
      deleteAllData,
      deleteBrand,
      deleteCategory,
      deletePromotion,
      dismissRecommendation,
      dismissToast,
      expirePromotion,
      hydrated,
      isRefreshing,
      login,
      logout,
      markAllNotificationsRead,
      markNotificationRead,
      recordView,
      refreshOffers,
      setBrands,
      setCategories,
      setPromotions,
      setSelectedBrands,
      setTheme,
      showToast,
      state,
      toasts,
      toggleBrand,
      toggleFavorite,
      toggleTheme,
      unreadNotificationsCount,
      updateAlerts,
      updateBrand,
      updateCategory,
      updatePromotion,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp doit être utilisé dans un AppProvider.");
  }
  return context;
}
