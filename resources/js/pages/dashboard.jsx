import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";
import toast from 'react-hot-toast';



const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { articles, categories } = usePage().props;

    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newArticle, setNewArticle] = useState({
        name: '',
        price: '',
        family: '',
        sub_family: '',
        qty: ''
    });


    const moadlControl = () => {
        isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewArticle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setNewArticle((prev) => ({
            ...prev,
            family: category,
        }));
    };

    const handleSubcategoryChange = (e) => {
        const sub_category = e.target.value;

        setNewArticle((prev) => ({
            ...prev,
            sub_family: sub_category,
        }));
    };


    const handleAddArticle = (e) => {
        e.preventDefault();

        // Post data using Inertia
        Inertia.post('/newArticle', product, {
            onSuccess: () => {
                // Close modal and reset form
                moadlControl();
                setProduct({
                    name: '',
                    quantity: '',
                    price: '',
                    wholesalePrice: '',
                    listPrice: '',
                    family: '',
                    sub_family: '',
                });
                toast.success('Artilce added successfully');
            },
            onError: (errors) => {
                console.error('Error adding product:', errors);
                toast.error('Failed to add article');
            },
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = articles && articles.map((product) => product.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                            <div className="bg-[rgba(255,255,255,0.1)] bg-opacity-10 backdrop-blur-3xl rounded-lg w-full max-w-xl p-6 shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Add New Product</h2>
                                    <button onClick={moadlControl} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                                        &times;
                                    </button>
                                </div>

                                <form onSubmit={handleAddArticle} className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={newArticle.name}
                                        onChange={handleInputChange}
                                        placeholder="Product Name"
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={newArticle.quantity}
                                        onChange={handleInputChange}
                                        placeholder="Quantity"
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                    <input
                                        disabled
                                        type="number"
                                        name="price"
                                        // value={newArticle.price}
                                        // onChange={handleInputChange}
                                        placeholder="Price"
                                        className="w-full border px-3 py-2 rounded disabled:opacity-10"
                                    />
                                    <input
                                        disabled
                                        type="number"
                                        name="wholesalePrice"
                                        // value={newArticle.wholesalePrice}
                                        // onChange={handleInputChange}
                                        placeholder="Wholesale Price"
                                        className="w-full border px-3 py-2 rounded disabled:opacity-10"
                                    />
                                    <input
                                        disabled
                                        type="number"
                                        name="listPrice"
                                        // value={newArticle.listPrice}
                                        // onChange={handleInputChange}
                                        placeholder="List Price"
                                        className="w-full border px-3 py-2 rounded disabled:opacity-10"
                                    />

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-white">Category</label>
                                        <select
                                            name="categoryId"
                                            className="w-full border px-3 py-2 rounded"
                                            value={newArticle.family === '' ? 'Select Subcategory' : newArticle.family}
                                            onChange={handleCategoryChange}
                                            required
                                        >
                                            <option className="text-black" disabled value="">
                                                Select Category
                                            </option>
                                            {categories ? categories.map((cat) => (
                                                <option className="text-black" key={cat.id} value={cat.intitule}>
                                                    {cat.intitule}
                                                </option>
                                            )) : ''}
                                        </select>
                                    </div>

                                    {newArticle.family && (
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-white">Subcategory</label>
                                            <select
                                                name="subcategoryId"
                                                className="w-full border px-3 py-2 rounded"
                                                value={newArticle.sub_family === '' ? 'Select Subcategory' : newArticle.sub_family}
                                                onChange={handleSubcategoryChange}
                                                required
                                            >
                                                <option className="text-black" disabled value="">
                                                    Select Subcategory
                                                </option>

                                                {categories
                                                    .find((cat) => cat.intitule === newArticle.family)
                                                    ?.subcategories.map((sub) => (
                                                        <option className="text-black" key={sub.id} value={sub.intitule}>
                                                            {sub.intitule}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}


                                    <div className="flex justify-end space-x-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={moadlControl}
                                            className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Anuller
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}



                    <>
                        <div className="flex gap-4 justify-end p-4">
                            {/* <button className="bg-white text-black px-4 py-2 rounded-md">Bulk Edit</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Categories</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Warehouses</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Add Products</button> */}
                            {/* <button className="bg-white text-black px-4 py-2 rounded-md">Import Products</button> */}
                            <button onClick={moadlControl} className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
                                <IoIosAdd /> Ajouter
                            </button>
                        </div>
                        {articles && articles.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className='text-xl'>
                                            <th className="text-left">
                                                <div className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selected.length === articles.length && articles.length}
                                                    />
                                                </div>
                                            </th>
                                            <th className="text-left"><div className="px-4 py-4">Product Id</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Designation</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Prix</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Famille</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Sous Famille</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Qty</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.map((product) => {
                                            const isItemSelected = isSelected(product.id);
                                            return (
                                                <tr key={product.id} className={isItemSelected ? 'bg-[rgba(249,250,251,0.2)]' : ''}>
                                                    <td>
                                                        <div className="px-4 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isItemSelected}
                                                                onChange={() => handleSelect(product.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td><div className="px-4 py-4 text-center">{product.id}</div></td>
                                                    <td><div className="px-4 py-4">{product.name}</div></td>
                                                    <td><div className="px-4 py-4">{product.price}</div></td>
                                                    <td><div className="px-4 py-4">{product.family}</div></td>
                                                    <td><div className="px-4 py-4">{product.sub_family}</div></td>
                                                    <td><div className="px-4 py-4">{product.qty}</div></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Content if there are no articles
                            <div className="flex h-full w-full items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-sidebar-text dark:text-sidebar-text-dark">
                                        Welcome to the Dashboard
                                    </h1>
                                    <p className="mt-2 text-sm text-sidebar-text dark:text-sidebar-text-dark">
                                        This is the dashboard page.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>


                </div>
            </div>
        </AppLayout>
    );
}
