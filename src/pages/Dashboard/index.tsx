import { Button, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import {
  Checklist,
  FormatListBulleted,
  FormatListNumbered,
  PieChartOutline,
  PlaylistPlay,
  PlaylistRemove,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import requestApi, { ESortRequest } from "@/api/request";
import _ from "lodash";
import useConfigStore from "@/stores/configStore";
import React from "react";
import utils from "@/utils";
import RequestStatusComponent from "@/pages/Requests/RequestStatusComponent";
import { ERequestStatus } from "@/utils/constants";

export interface IDashboardProps {}

export default function Dashboard(_props: IDashboardProps) {
  const navigate = useNavigate();

  const { data: countStatus } = useQuery({
    queryFn: requestApi.countStatus,
    queryKey: ["requestApi.countStatus"],
  });

  const { data: countProductType } = useQuery({
    queryFn: requestApi.countProductType,
    queryKey: ["requestApi.countProductType"],
  });

  const objProductType = useConfigStore((s) => s.objMapData.productType);

  const { data: listNew } = useQuery({
    queryFn: () =>
      requestApi.find({
        page: 0,
        pageSize: 5,
        sort: ESortRequest["createdAt:desc"],
      }),
    queryKey: ["requestApi.listNew"],
  });

  return (
    <div className="container mx-auto mt-20 p-4">
      <div className="flex justify-between items-center">
        <div className="text-3xl">Trang tổng quan</div>
        <Button
          onClick={() => navigate("/requests", { state: { create: true } })}
          sx={{ color: "white" }}
          startIcon={<AddIcon />}
          variant="contained"
          color="secondary"
        >
          Tạo yêu cầu
        </Button>
      </div>

      <div className="grid grid-cols-12 w-full gap-4 mt-4">
        <Card className="flex p-4 col-span-12">
          {[
            {
              title: "Tổng số yêu cầu",
              count: Object.values(countStatus || {}).reduce(
                (d, e) => (d += Number(e)),
                0
              ),
              to: `/requests`,
              color: "#E48E3E",
              icon: FormatListBulleted,
            },
            {
              title: "Yêu cầu đang làm",
              count:
                _.sum([
                  countStatus?.doing,
                  countStatus?.needEdit,
                  countStatus?.review,
                ]) || 0,
              to: `/requests?status=${ERequestStatus.doing}`,
              color: "#009721",
              icon: PlaylistPlay,
            },
            {
              title: "Yêu cầu đã xong",
              count: countStatus?.done || 0,
              to: `/requests?status=${ERequestStatus.done}`,
              color: "#4865FF",
              icon: Checklist,
            },
            {
              title: "Yêu cầu đã hủy",
              count: countStatus?.cancel || 0,
              to: `/requests?status=${ERequestStatus.cancel}`,
              color: "",
              icon: PlaylistRemove,
            },
          ].map((d, i) => {
            const Icon = d.icon;
            return (
              <div
                className="flex-1 flex justify-center first:border-l-0 border-l p-4"
                key={i}
              >
                <div className="flex gap-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !d.color ? "shadow" : ""
                    }`}
                    style={{
                      background: d.color,
                      color: d.color ? "#fff" : "",
                    }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <div className="font-light">{d.title}</div>
                    <b className="text-2xl" style={{ color: d.color }}>
                      {d.count}
                    </b>
                    <div className="text-right">
                      <Link
                        className="font-bold"
                        to={d.to}
                        style={{ color: d.color }}
                      >
                        Xem thêm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
        <Card className="p-4 col-span-8">
          <div className="flex items-center gap-2">
            <PieChartOutline />
            Danh sách sản phẩm
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {!_.isEmpty(countProductType) ? (
              Object.keys(countProductType || {}).map((productTypeId) => {
                const max =
                  countProductType?.[
                    Object.keys(
                      countProductType || {}
                    )?.[0] as unknown as number
                  ];
                const count = countProductType?.[
                  productTypeId as unknown as number
                ] as number;
                const productType = objProductType?.[productTypeId];
                if (!productType)
                  return <React.Fragment key={productTypeId}></React.Fragment>;

                return (
                  <div key={productTypeId} className="flex flex-col gap-1">
                    <div className="">{productType.name}</div>

                    <div className="flex w-full items-center gap-4">
                      <div className="h-1 bg-gray-300 relative w-11/12 rounded-3xl overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-orange-500"
                          style={{ width: `${(count / (max || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-1/12">{count}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-400">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </Card>
        <Card className="p-4 col-span-4">
          {" "}
          <div className="flex items-center gap-2">
            <FormatListNumbered />
            Các yêu cầu mới nhất
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {listNew?.data?.length ? (
              listNew?.data?.map((request) => {
                return (
                  <div key={request.id} className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                      <img
                        className="object-cover aspect-square rounded-lg"
                        src={utils.getImageStrapi(request.photos?.[0])}
                        alt=""
                      />
                    </div>
                    <div className="col-span-5 items-center flex">
                      {request.name}
                    </div>
                    <div className="col-span-4 items-center flex">
                      {RequestStatusComponent[request.status]}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-400">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
