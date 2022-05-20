import React, { useEffect, useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { MdLocalLaundryService } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NavbarComponent from "../components/common/navbar_component";
import SidebarComponent from "../components/common/sidebar_component";
import {
  CARD_DATA,
  DisplayManagementCard,
  GraphDisplay,
  ProductServiceCard,
} from "../components/management_component";
import CreateServiceModal from "../components/modals/create_service_modal";
import { useSelector } from "react-redux";
import { useGetProducts } from "../helpers/hooks/useStartDepHooks";

const MySwal = withReactContent(Swal);

const sidebarItems = [
  {
    label: "Cash Flow",
    value: 1,
    icon: <FaMoneyBill size={20} />,
  },
  {
    label: "Services",
    value: 2,
    icon: <MdLocalLaundryService size={20} />,
  },
];

const ManagementView = () => {
  const [page, setPage] = useState(1);
  useGetProducts();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.role === "admin") return setPage(2);
  }, []);

  return (
    <React.Fragment>
      <div className="flex flex-row">
        <div className="h-screen max-h-full">
          <SidebarComponent item={sidebarItems} setItem={setPage} />
        </div>
        <div className="flex-grow">
          <NavbarComponent title="MANAGEMENT" />
          <div className="mt-5 mx-5">
            {page === 1 && <CashFlowDisplay />}
            {page === 2 && <ProductServices />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ManagementView;

const CashFlowDisplay = () => {
  const [board, setBoard] = useState(0);
  return (
    <div>
      <div className="flex flex-row gap-3 h-full">
        <div className="w-9/12">
          <GraphDisplay board={board} setBoard={setBoard} />
        </div>
        <div className="w-3/12 flex flex-col gap-3">
          {CARD_DATA.map((element, key) => {
            return (
              <div key={key} onClick={() => setBoard(key)}>
                <DisplayManagementCard data={element} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductServices = () => {
  const { products } = useSelector((state) => state.service_product);
  return (
    <React.Fragment>
      <div className="object-contain flex flex-row justify-between items-center">
        <p className="text-xl text-gray-500 font-bold">ALL SERVICES</p>
        <button
          onClick={() => createNewProduct()}
          className="px-5 py-3 rounded bg-black text-white hover:bg-gray-900 active:translate-y-1"
        >
          Add Service
        </button>
      </div>
      <div className="w-full grid grid-cols-5 gap-3">
        {products?.map((element, key) => {
          return <ProductServiceCard key={key} item={element} />;
        })}
      </div>
    </React.Fragment>
  );
};

const createNewProduct = () => {
  MySwal.fire({
    width: 700,
    html: <CreateServiceModal />,
    showConfirmButton: false,
    showCloseButton: true,
  });
};
