import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import request from "@/shared/utils/request";
import type { IUser, GlobalRole } from "@codigo/schema";

const { Search } = Input;

export default function AdminUsers() {
  const [data, setData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await request(`/admin/users`, {
        params: { page, limit: 10, search },
      });
      setData(res.list);
      setTotal(res.total);
      setCurrentPage(page);
    } catch (error) {
      message.error("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: GlobalRole) => {
    try {
      await request(`/admin/users/${userId}/role`, {
        method: "PUT",
        data: { role: newRole },
      });
      message.success("角色修改成功");
      fetchUsers(currentPage, searchText);
    } catch (error: any) {
      message.error(error.message || "角色修改失败");
    }
  };

  const handleStatusChange = async (
    userId: number,
    newStatus: "active" | "frozen",
  ) => {
    try {
      await request(`/admin/users/${userId}/status`, {
        method: "PUT",
        data: { status: newStatus },
      });
      message.success("状态修改成功");
      fetchUsers(currentPage, searchText);
    } catch (error: any) {
      message.error(error.message || "状态修改失败");
    }
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "角色",
      key: "global_role",
      dataIndex: "global_role",
      render: (role: GlobalRole, record) => (
        <Select
          value={role}
          size="small"
          style={{ width: 120 }}
          disabled={record.global_role === "SUPER_ADMIN"}
          onChange={(val) => handleRoleChange(record.id, val)}
          options={[
            { value: "USER", label: "普通用户" },
            { value: "ADMIN", label: "管理员" },
            { value: "SUPER_ADMIN", label: "超级管理员", disabled: true },
          ]}
        />
      ),
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "正常" : "冻结"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        if (record.global_role === "SUPER_ADMIN") return null;

        const isFrozen = record.status === "frozen";
        return (
          <Space size="middle">
            <Popconfirm
              title={`确定要${isFrozen ? "解冻" : "冻结"}该用户吗？`}
              onConfirm={() =>
                handleStatusChange(record.id, isFrozen ? "active" : "frozen")
              }
            >
              <Button type="link" danger={!isFrozen} size="small">
                {isFrozen ? "解冻账号" : "冻结账号"}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold m-0">用户管理</h1>
        <Search
          placeholder="搜索用户名或手机号"
          allowClear
          onSearch={(val) => {
            setSearchText(val);
            fetchUsers(1, val);
          }}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: 10,
          onChange: (page) => fetchUsers(page, searchText),
        }}
      />
    </div>
  );
}
