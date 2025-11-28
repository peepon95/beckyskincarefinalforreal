import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Package, X, ChevronRight } from 'lucide-react-native';

type ProductStatus = 'safe' | 'conflict';

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string | null;
  status: ProductStatus;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Rare Earth Deep Pore Cleansing',
    brand: "Kiehl's",
    category: 'Cleanser',
    image: null,
    status: 'safe',
  },
  {
    id: 2,
    name: 'Heartleaf 70 Daily Lotion',
    brand: 'Anua',
    category: 'Moisturizer',
    image: null,
    status: 'safe',
  },
  {
    id: 3,
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    category: 'Serum',
    image: null,
    status: 'safe',
  },
  {
    id: 4,
    name: 'Vitamin C Suspension 23%',
    brand: 'The Ordinary',
    category: 'Serum',
    image: null,
    status: 'safe',
  },
  {
    id: 5,
    name: 'Gentle Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    image: null,
    status: 'safe',
  },
  {
    id: 6,
    name: 'Daily Facial Moisturizer',
    brand: 'CeraVe',
    category: 'Moisturizer',
    image: null,
    status: 'safe',
  },
  {
    id: 7,
    name: 'Mineral Sunscreen SPF 50',
    brand: 'La Roche-Posay',
    category: 'Sunscreen',
    image: null,
    status: 'safe',
  },
  {
    id: 8,
    name: 'BHA 2% Liquid Exfoliant',
    brand: "Paula's Choice",
    category: 'Exfoliant',
    image: null,
    status: 'safe',
  },
  {
    id: 9,
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Serum',
    image: null,
    status: 'safe',
  },
  {
    id: 10,
    name: 'AHA 30% + BHA 2% Peeling Solution',
    brand: 'The Ordinary',
    category: 'Treatment',
    image: null,
    status: 'safe',
  },
  {
    id: 11,
    name: 'Retinol 0.5% in Squalane',
    brand: 'The Ordinary',
    category: 'Treatment',
    image: null,
    status: 'safe',
  },
  {
    id: 12,
    name: 'Azelaic Acid Suspension 10%',
    brand: 'The Ordinary',
    category: 'Treatment',
    image: null,
    status: 'safe',
  },
  {
    id: 13,
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    image: null,
    status: 'safe',
  },
  {
    id: 14,
    name: 'Ultra Facial Cream',
    brand: "Kiehl's",
    category: 'Moisturizer',
    image: null,
    status: 'safe',
  },
  {
    id: 15,
    name: 'Toleriane Double Repair Face Moisturizer',
    brand: 'La Roche-Posay',
    category: 'Moisturizer',
    image: null,
    status: 'safe',
  },
];

type FilterType = 'all' | 'safe' | 'conflicts';

export default function Products() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'safe' && product.status === 'safe') ||
      (activeFilter === 'conflicts' && product.status === 'conflict');

    return matchesSearch && matchesFilter;
  });

  const safeCount = products.filter((p) => p.status === 'safe').length;
  const conflictCount = products.filter((p) => p.status === 'conflict').length;

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Products</Text>
          <Text style={styles.subtitle}>
            {products.length} products in your collection
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#6B7280" size={20} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All ({products.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'safe' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('safe')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'safe' && styles.filterTabTextActive,
              ]}
            >
              ✓ Safe ({safeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'conflicts' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('conflicts')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'conflicts' && styles.filterTabTextActive,
              ]}
            >
              ⚠️ Conflicts ({conflictCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/scan-products')}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>

        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              <Package color="#9CA3AF" size={28} strokeWidth={2} />
            </View>

            <View style={styles.productContent}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>
                {product.brand} • {product.category || 'uncategorised'}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  product.status === 'safe'
                    ? styles.statusBadgeSafe
                    : styles.statusBadgeConflict,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    product.status === 'safe'
                      ? styles.statusTextSafe
                      : styles.statusTextConflict,
                  ]}
                >
                  {product.status === 'safe'
                    ? '✓ Safe to use'
                    : '⚠️ Check conflicts'}
                </Text>
              </View>
            </View>

            <View style={styles.productActions}>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsText}>Details</Text>
                <ChevronRight color="#A8C8A5" size={16} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeProduct(product.id)}
              >
                <X color="#9CA3AF" size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    height: 48,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
  },
  filterTabs: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterTabActive: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContent: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  productMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    marginTop: 8,
  },
  statusBadgeSafe: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeConflict: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextSafe: {
    color: '#059669',
  },
  statusTextConflict: {
    color: '#F59E0B',
  },
  productActions: {
    gap: 8,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#A8C8A5',
    fontWeight: '600',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
