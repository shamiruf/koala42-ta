import React, { useCallback, useEffect, useRef, useState } from "react";
import { Popconfirm, Table } from "antd";
import { ColumnType } from "antd/lib/table";
interface RowType {
  data?: {};
  kids?: { [index: string]: any };
}

interface OverviewTableProps {
  data?: Array<RowType>;
}

const OverviewTable: React.FC<OverviewTableProps> = ({
  data,
}: OverviewTableProps) => {
  const [dataSource1, setDataSource1] = useState<any[]>();
  const [columns1, setColumns1] = useState<any[]>();

  const getColumns = useCallback((plainData: any) => {
    if (!plainData || plainData.length === 0) return;
    console.log("plainData");
    console.log(plainData);
    const columns: Array<ColumnType<any>> = [];
    const titles: string[] =
      plainData && plainData[0].data && Object.keys(plainData[0].data);
    titles &&
      titles.forEach((title) => {
        columns.push({ title, dataIndex: title, key: title });
      });
    columns.push({
      dataIndex: "",
      key: "x",
      render: (record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <p>x</p>
        </Popconfirm>
      ),
    });
    return columns;
  }, []);

  const handleDelete = (key: any) => {
    setDataSource1((prevState) => {
      return (
        prevState &&
        prevState.filter((row: any) => {
          return row.key !== key;
        })
      );
    });
  };

  const formatTableData = useCallback((plainData: any) => {
    let formattedData: any = [];

    if (plainData) {
      formattedData = plainData.map((row: any, index: any) => {
        const rowContainer: { [index: string]: any } = {};
        rowContainer.key = `${index.toString()}${Math.random()}`;
        Object.assign(rowContainer, row.data);
        rowContainer.kids =
          (row.kids &&
            row.kids.has_relatives && [...row.kids.has_relatives.records]) ||
          (row.kids && row.kids.has_phone && [...row.kids.has_phone.records]);

        return rowContainer;
      });
    }
    return formattedData;
  }, []);

  const expandedRowRender3level = useCallback(
    (record: any) => {
      if (!record.kids) return;
      const thirdLevelColumns = getColumns(record.kids);
      const thirdLevelTableData: any[] = formatTableData(record.kids);
      return (
        <Table
          columns={thirdLevelColumns}
          dataSource={thirdLevelTableData}
          pagination={false}
          key={Math.random()}
        />
      );
    },
    [formatTableData, getColumns]
  );

  const expandedRowRender2level = useCallback(
    (record: any) => {
      if (!record.kids) return;
      console.log("record.kids");
      console.log(record.kids);
      const secondLevelTableData: any[] = formatTableData(record.kids);
      const secondLevelColumns = getColumns(secondLevelTableData);
      console.log("secondLevelTableData");
      console.log(secondLevelTableData);

      return (
        <Table
          key={Math.random()}
          columns={secondLevelColumns}
          dataSource={secondLevelTableData}
          pagination={false}
          expandable={{
            expandedRowRender: expandedRowRender3level,
            rowExpandable: (record: any) => record.kids && record,
          }}
        />
      );
    },
    [expandedRowRender3level, formatTableData, getColumns]
  );

  useEffect(() => {
    setDataSource1(formatTableData(data));
    setColumns1(getColumns(data));
  }, [data, formatTableData, getColumns]);

  useEffect(() => {
    console.log(dataSource1);
  }, [dataSource1]);

  return (
    <Table
      columns={columns1}
      expandable={{
        expandedRowRender: expandedRowRender2level,
        rowExpandable: (record: any) => record.kids && record,
      }}
      dataSource={dataSource1}
    />
  );
};

export default OverviewTable;
