import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";

const products = [
    { id: "10061", name: "Substance", price: 25.0, wholesalePrice: 13.0, listPrice: 0.0, qty: 180 },
    { id: "10063", name: "Charmander", price: 20.0, wholesalePrice: 0.0, listPrice: 0.0, qty: 350 },
    { id: "10064", name: "Greatfire", price: 30.5, wholesalePrice: 0.0, listPrice: 0.0, qty: 220 },
    { id: "10062", name: "Galeth", price: 70.2, wholesalePrice: 0.0, listPrice: 0.0, qty: 18 },
    { id: "10065", name: "Sparkle", price: 12.0, wholesalePrice: 10.0, listPrice: 13.0, qty: 50 },
    { id: "10066", name: "Vaporeon", price: 60.0, wholesalePrice: 0.0, listPrice: 0.0, qty: 135 },
];

const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Furniture" },
];

const subcategories = [
    { id: 101, name: "Phones", category_id: 1 },
    { id: 102, name: "Laptops", category_id: 1 },
    { id: 103, name: "Cameras", category_id: 1 },
    { id: 201, name: "Shirts", category_id: 2 },
    { id: 202, name: "Pants", category_id: 2 },
    { id: 301, name: "Chairs", category_id: 3 },
];

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

    const moadlControl = () => {
        isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
    }

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = products.map((product) => product.id);
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
                                    <button onClick={moadlControl} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                                </div>

                                {/* Form inputs here */}
                                <form className="space-y-4">

                                    <input type="text" placeholder="Product Name" className="w-full border px-3 py-2 rounded" />
                                    <input type="number" placeholder="Quantity" className="w-full border px-3 py-2 rounded" />
                                    <input disabled type="number" placeholder="Price" className="w-full border px-3 py-2 rounded disabled:opacity-10" />
                                    <input disabled type="number" placeholder="Wholesale Price" className="w-full border px-3 py-2 rounded disabled:opacity-10" />
                                    <input disabled type="number" placeholder="List Price" className="w-full border px-3 py-2 rounded disabled:opacity-10" />

                                    {/* Category Dropdown */}
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-white">Category</label>
                                        <select
                                            className="w-full border px-3 py-2 rounded"
                                            value={selectedCategoryId ?? ''}
                                            onChange={(e) => {
                                                const id = Number(e.target.value);
                                                setSelectedCategoryId(id);
                                                setSelectedSubcategoryId(null);
                                            }}
                                        >
                                            <option className='text-black' disabled value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option className='text-black' key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Subcategory Dropdown */}
                                    {selectedCategoryId ? (
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-white">Subcategory</label>
                                            <select
                                                className="w-full border px-3 py-2 rounded"
                                                value={selectedSubcategoryId ?? ''}
                                                onChange={(e) => setSelectedSubcategoryId(Number(e.target.value))}
                                            >
                                                <option className='text-black' disabled value="">Select Subcategory</option>
                                                {subcategories
                                                    .filter((sub) => sub.category_id === selectedCategoryId)
                                                    .map((sub) => (
                                                        <option className='text-black' key={sub.id} value={sub.id}>{sub.name}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    ): ''}

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <button type="button" onClick={moadlControl} className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}


                    {products.length > 0 ?
                        <>
                            <div className="flex gap-4 justify-end p-4 ">
                                {/* <button className="bg-white text-black px-4 py-2 rounded-md">Bulk Edit</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Categories</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Warehouses</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Add Products</button> */}
                                {/* <button className="bg-white text-black px-4 py-2 rounded-md">Import Products</button> */}
                                <button onClick={moadlControl} className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"><IoIosAdd /> Ajouter</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className='text-xl'>
                                            <th className="text-left">
                                                <div className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selected.length === products.length}
                                                    />
                                                </div>
                                            </th>
                                            <th className="text-left"><div className="px-4 py-4">Product Id</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Name</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Price</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Wholesale Price</div></th>
                                            <th className="text-left"><div className="px-4 py-4">List Price</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Qty On Hand</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => {
                                            const isItemSelected = isSelected(product.id);
                                            return (
                                                <tr
                                                    key={product.id}
                                                    className={isItemSelected ? 'bg-[rgba(249,250,251,0.2)]' : ''}
                                                >
                                                    <td>
                                                        <div className="px-4 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isItemSelected}
                                                                onChange={() => handleSelect(product.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td><div className="px-4 py-4">{product.id}</div></td>
                                                    <td><div className="px-4 py-4">{product.name}</div></td>
                                                    <td><div className="px-4 py-4">{product.price.toFixed(2)}</div></td>
                                                    <td><div className="px-4 py-4">{product.wholesalePrice.toFixed(2)}</div></td>
                                                    <td><div className="px-4 py-4">{product.listPrice.toFixed(2)}</div></td>
                                                    <td><div className="px-4 py-4">{product.qty}</div></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </div>
                        </>
                        : {/* <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-sidebar-text dark:text-sidebar-text-dark">
                                Welcome to the Dashboard
                            </h1>
                            <p className="mt-2 text-sm text-sidebar-text dark:text-sidebar-text-dark">
                                This is the dashboard page.
                            </p>
                        </div>
                    </div> */}}
                </div>
            </div>
        </AppLayout>
    );
}
