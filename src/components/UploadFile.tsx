import React, { useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const UploadFile = () => {
  const [jsonData, setJsonData] = useState();

  useEffect(() => {
    console.log(jsonData && jsonData[0]);
  }, [jsonData]);

  return (
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
  );
};

export default UploadFile;
