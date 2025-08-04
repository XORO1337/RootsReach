import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

export interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    weightUnit?: string;
    stock: number;
    images: string[];
    status: string;
    artisanId?: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      city?: string;
      state?: string;
    } | null;
  };
  addedAt: string;
}

export interface WishlistData {
  userId: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt?: string;
  updatedAt?: string;
}

interface WishlistContextType {
  wishlist: WishlistData | null;
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlistItem: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  getWishlistItemsCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlist(null);
      setError(null);
    }
  }, [isAuthenticated, user?.id]);

  const fetchWishlist = async () => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/wishlist');
      
      if (response.data.success) {
        setWishlist(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch wishlist');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch wishlist';
      setError(errorMessage);
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please log in to add items to your wishlist');
      return;
    }

    try {
      const response = await api.post('/api/wishlist/add', { productId });
      
      if (response.data.success) {
        setWishlist(response.data.data);
        toast.success('Added to wishlist!', {
          icon: '❤️',
          duration: 2000
        });
      } else {
        throw new Error(response.data.message || 'Failed to add to wishlist');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add to wishlist';
      if (errorMessage.includes('already in wishlist')) {
        toast.error('Product is already in your wishlist');
      } else {
        toast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    try {
      const response = await api.delete(`/api/wishlist/remove/${productId}`);
      
      if (response.data.success) {
        setWishlist(response.data.data);
        toast.success('Removed from wishlist', {
          icon: '💔',
          duration: 2000
        });
      } else {
        throw new Error(response.data.message || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleWishlistItem = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please log in to manage your wishlist');
      return false;
    }

    try {
      const response = await api.post('/api/wishlist/toggle', { productId });
      
      if (response.data.success) {
        setWishlist(response.data.data);
        const wasAdded = response.data.data.action === 'added';
        
        if (wasAdded) {
          toast.success('Added to wishlist!', {
            icon: '❤️',
            duration: 2000
          });
        } else {
          toast.success('Removed from wishlist', {
            icon: '💔',
            duration: 2000
          });
        }
        
        return wasAdded;
      } else {
        throw new Error(response.data.message || 'Failed to update wishlist');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (!wishlist || !wishlist.items) {
      return false;
    }
    return wishlist.items.some(item => item.productId._id === productId);
  };

  const clearWishlist = async () => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    try {
      const response = await api.delete('/api/wishlist/clear');
      
      if (response.data.success) {
        setWishlist(response.data.data);
        toast.success('Wishlist cleared');
      } else {
        throw new Error(response.data.message || 'Failed to clear wishlist');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to clear wishlist';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getWishlistItemsCount = (): number => {
    return wishlist?.totalItems || 0;
  };

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist,
    clearWishlist,
    fetchWishlist,
    getWishlistItemsCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
