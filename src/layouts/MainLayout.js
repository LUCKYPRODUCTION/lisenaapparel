"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayout = MainLayout;
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("../components/Sidebar");
var Header_1 = require("../components/Header");
function MainLayout() {
    return (<div className="flex h-screen overflow-hidden">
      <Sidebar_1.Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header_1.Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <react_router_dom_1.Outlet />
        </main>
      </div>
    </div>);
}
