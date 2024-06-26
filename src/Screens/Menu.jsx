import React, { useEffect, useState } from 'react'
import Wrapper from '../Components/Wrapper'
import RIderMenu from '../Components/RIderMenu'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Form, useNavigate } from 'react-router-dom'
import AddMenu from './AddMenu'
import { Routes, Route } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import AppLayout from '../Layout/AppLayout'
import resturantApi from '../Services/restaurantapi'
import toast from 'react-hot-toast'
import Spin from '../Components/Spin'
import EditProduct from './EditProduct'
import { FormattedMessage, useIntl } from 'react-intl'

const MenuPage = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState()
    const [fetching, setFetching] = useState(true)
    const toggleRiderForm = () => {
        navigate('/menu/add-menu')
    }
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await resturantApi.get('/products')
                setProducts(response.data.data)
                setFetching(false)
            } catch (error) {
                console.error(error)

                setFetching(false)
            }
        }
        getAllProducts()
    }, [])

    const intl = useIntl();
    const confirmMessage = intl.formatMessage({ id: 'Are you sure you want to delete this item?' });

    const deleteProduct = async (id) => {
        if (window.confirm(confirmMessage)) {
            try {
                const response = await resturantApi.delete(`/products/${id}`)
                toast.success(response.data.message)
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== id),
                )
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <Wrapper>
            <div className='flex flex-col'>
                <RIderMenu
                    toggleRiderForm={toggleRiderForm}
                    heading={<FormattedMessage id='menu_control_panel' />}
                    para={<FormattedMessage id='simplified_menu_management' />}
                    image={'/src/assets/chef.png'}
                    modalButtonText={<FormattedMessage id='+add_item' />}
                    cardsMainHeading={'Menu (Total Items)'}
                />
                <div className='py-8 mx-5 lg:mx-0 lg:mr-5'>
                    <h3 className='text-2xl font-semibold text-gray-800'>
                        <FormattedMessage id='Menu (Total Items)' />
                    </h3>
                    {fetching && (
                        <div className='flex justify-center items-center'>
                            <Spin />
                        </div>
                    )}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 mt-4'>
                        {products?.map((product) => {
                            return (
                                <div
                                    className='bg-white rounded-2xl shadow-md'
                                    key={product?.id}
                                >
                                    <img
                                        src={product?.display_picture}
                                        alt='product image'
                                        className='rounded-lg w-full'
                                        loading='lazy'
                                    />
                                    <div className='px-3 py-4'>
                                        <div className='flex justify-start flex-col mb-3'>
                                            <div className='flex flex-row justify-between'>
                                                <div className='flex flex-col gap-y-3'>
                                                    <span className='text-gray-800 font-bold'>
                                                        {product?.name}
                                                    </span>
                                                    <select
                                                        name='availability'
                                                        id='availability'
                                                        className='form-select rounded-2xl py-0'
                                                    >
                                                        <option value='available'>
                                                            <FormattedMessage id='Available' />
                                                        </option>
                                                        <option value='unavailable'>
                                                            <FormattedMessage id='Unavailable' />
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className='bg-textActive text-white w-16 h-7 rounded-2xl text-center text-sm flex justify-center items-center'>
                                                    $10.00
                                                </div>
                                            </div>
                                            <div className='py-2 text-gray-800'>
                                                <span>
                                                    {product?.description}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                <NavLink
                                                    className='bg-blue-500 text-white px-5 py-1 rounded-md flex items-center'
                                                    to={`/menu/edit-menu/${product?.id}`}
                                                >
                                                    <FiEdit className='mr-1' />
                                                    <FormattedMessage id='Edit' />
                                                </NavLink>
                                            </div>
                                            <div>
                                                <button
                                                    className='bg-red-500 text-white px-5 py-1 rounded-md flex items-center'
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product?.id,
                                                        )
                                                    }
                                                >
                                                    <RiDeleteBin6Line className='mr-1' />
                                                    <FormattedMessage id='Delete' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {products === null && <h1>No Products Fetched</h1>}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Menu = () => {
    return (
        <Routes>
            <Route path='/' element={<MenuPage />} />
            <Route path='/add-menu' element={<AddMenu />} />
            <Route path={`/edit-menu/:id`} element={<EditProduct />} />
        </Routes>
    )
}

export default AppLayout()(Menu)
