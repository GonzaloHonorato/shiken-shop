import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { Product, ProductCategoryEnum } from '../../models';

// ===================================
// ADMIN PRODUCTS COMPONENT
// ===================================

interface ProductFilter {
  search: string;
  category: string;
  stock: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // ===================================
  // REACTIVE STATE
  // ===================================
  
  // State signals
  readonly isLoading = signal(false);
  readonly isModalOpen = signal(false);
  readonly filter = signal<ProductFilter>({
    search: '',
    category: '',
    stock: ''
  });
  readonly editingProduct = signal<Product | null>(null);

  // Product form
  readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(0)]],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    image: [''],
    active: [true],
    featured: [false]
  });

  // Filter form
  readonly filterForm: FormGroup = this.fb.group({
    search: [''],
    category: [''],
    stock: ['']
  });

  // Computed properties
  readonly products = computed(() => this.dataService.products());
  readonly filteredProducts = computed(() => this.applyFilters());
  readonly isEditing = computed(() => this.editingProduct() !== null);
  readonly modalTitle = computed(() => this.isEditing() ? 'Editar Producto' : 'Nuevo Producto');

  // Categories for dropdown
  readonly categories = [
    { value: ProductCategoryEnum.ACCION, label: 'Acción' },
    { value: ProductCategoryEnum.RPG, label: 'RPG' },
    { value: ProductCategoryEnum.ESTRATEGIA, label: 'Estrategia' },
    { value: ProductCategoryEnum.AVENTURA, label: 'Aventura' }
  ];

  // Stock options for filter
  readonly stockOptions = [
    { value: '', label: 'Todos' },
    { value: 'available', label: 'Disponible' },
    { value: 'out-of-stock', label: 'Sin Stock' }
  ];

  // ===================================
  // LIFECYCLE
  // ===================================

  ngOnInit(): void {
    console.log('🛠️ Admin Products - Inicializando...');
    
    // Verify admin access
    if (!this.authService.isAdmin()) {
      this.notificationService.error('Acceso denegado: Se requieren permisos de administrador');
      this.router.navigate(['/']);
      return;
    }

    this.setupFilterSubscription();
  }

  // ===================================
  // FILTER MANAGEMENT
  // ===================================

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(filterValue => {
      this.filter.set(filterValue);
    });
  }

  private applyFilters(): Product[] {
    const products = this.products();
    const currentFilter = this.filter();

    return products.filter(product => {
      // Search filter
      const matchesSearch = !currentFilter.search || 
        product.name.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        product.description.toLowerCase().includes(currentFilter.search.toLowerCase());

      // Category filter  
      const matchesCategory = !currentFilter.category || 
        product.category === currentFilter.category;

      // Stock filter
      const matchesStock = !currentFilter.stock ||
        (currentFilter.stock === 'available' && product.stock > 0) ||
        (currentFilter.stock === 'out-of-stock' && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      category: '',
      stock: ''
    });
  }

  // ===================================
  // PRODUCT MANAGEMENT
  // ===================================

  openNewProductModal(): void {
    this.editingProduct.set(null);
    this.productForm.reset({
      name: '',
      category: '',
      description: '',
      price: '',
      discount: 0,
      stock: '',
      image: '',
      active: true,
      featured: false
    });
    this.isModalOpen.set(true);
  }

  editProduct(product: Product): void {
    console.log('✏️ Editando producto:', product);
    
    this.editingProduct.set(product);
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      discount: product.discount || 0,
      stock: product.stock,
      image: product.image || '',
      active: product.active,
      featured: product.featured || false
    });
    this.isModalOpen.set(true);
    
    console.log('✏️ Formulario poblado con valores:', this.productForm.value);
  }

  deleteProduct(product: Product): void {
    console.log('🗑️ Intentando eliminar producto:', product);
    
    if (!confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      return;
    }

    this.isLoading.set(true);

    try {
      const result = this.dataService.deleteProduct(product.id);
      console.log('🗑️ Resultado eliminación:', result);
      
      if (result) {
        this.notificationService.success(`Producto "${product.name}" eliminado correctamente`);
      } else {
        this.notificationService.error('No se pudo encontrar el producto para eliminar');
      }
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      this.notificationService.error('Error al eliminar el producto');
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleProductStatus(product: Product): void {
    this.isLoading.set(true);

    try {
      const updatedProduct: Product = {
        ...product,
        active: !product.active
      };

      this.dataService.updateProduct(product.id, updatedProduct);
      
      const status = updatedProduct.active ? 'activado' : 'desactivado';
      this.notificationService.success(`Producto ${status} correctamente`);
    } catch (error) {
      console.error('Error actualizando estado del producto:', error);
      this.notificationService.error('Error al actualizar el estado del producto');
    } finally {
      this.isLoading.set(false);
    }
  }

  onSaveProduct(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      this.notificationService.warning('Por favor completa todos los campos requeridos');
      return;
    }

    this.isLoading.set(true);
    const formValue = this.productForm.value;

    try {
      const productData: Partial<Product> = {
        name: formValue.name,
        category: formValue.category,
        description: formValue.description,
        price: Number(formValue.price),
        originalPrice: Number(formValue.price), // Set original price same as price initially
        discount: Number(formValue.discount) || 0,
        stock: Number(formValue.stock),
        image: formValue.image || this.generateDefaultImage(formValue.name),
        active: formValue.active,
        featured: formValue.featured
      };

      if (this.isEditing()) {
        // Update existing product
        const product = this.editingProduct()!;
        const updatedProduct = { ...product, ...productData };
        this.dataService.updateProduct(product.id, updatedProduct);
        this.notificationService.success('Producto actualizado correctamente');
        console.log('✅ Producto actualizado:', updatedProduct);
      } else {
        // Create new product with all required fields
        const newProduct: Omit<Product, 'id'> = {
          name: productData.name!,
          description: productData.description!,
          category: productData.category!,
          price: productData.price!,
          originalPrice: productData.originalPrice!,
          discount: productData.discount!,
          stock: productData.stock!,
          image: productData.image!,
          active: productData.active!,
          featured: productData.featured!,
          rating: 0,
          reviews: 0,
          releaseDate: new Date().toISOString().split('T')[0],
          developer: 'ShikenShop',
          platform: ['PC'],
          tags: [productData.category!],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.dataService.createProduct(newProduct);
        this.notificationService.success('Producto creado correctamente');
        console.log('✅ Producto creado:', newProduct);
      }

      this.closeModal();
    } catch (error) {
      console.error('Error guardando producto:', error);
      this.notificationService.error('Error al guardar el producto');
    } finally {
      this.isLoading.set(false);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  calculateFinalPrice(price: number, discount: number): number {
    return discount > 0 ? price * (1 - discount / 100) : price;
  }

  getCategoryLabel(category: string): string {
    const categoryObj = this.categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.label : category.toUpperCase();
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (stock <= 5) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border border-green-500/30';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock <= 5) return `Poco stock (${stock})`;
    return `${stock} disponibles`;
  }

  private generateDefaultImage(productName: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(productName)}&size=400&background=7c3aed&color=fff`;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // ===================================
  // FORM VALIDATION HELPERS
  // ===================================

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    }
    return '';
  }

  // ===================================
  // NAVIGATION
  // ===================================

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  onLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }

  // ===================================
  // TRACKING FUNCTION
  // ===================================

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}