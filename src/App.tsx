import React, { useState } from "react";
import OverviewTable from "./components/OverviewTable";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const App = () => {
  const [jsonData, setJsonData] = useState();
  return (
    <React.Fragment>
      <Upload
        accept={".json"}
        showUploadList={false}
        beforeUpload={(file) => {
          const reader = new FileReader();
          reader.readAsText(file);

          reader.onload = (e) => {
            e.target &&
              e.target.result &&
              setJsonData(JSON.parse(e.target.result.toString()));
          };

          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Upload json only</Button>
      </Upload>
      <OverviewTable data={jsonData} />
    </React.Fragment>
  );
};

export default App;
