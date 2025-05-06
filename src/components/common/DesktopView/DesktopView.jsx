import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { config } from '../../../config';
import {
  Container,
  Card,
  Title,
  Description,
  Input,
  Button,
  ButtonGroup,
  ErrorMessage,
  QRContainer,
  InstructionList,
  Instruction,
  EventTitle,
  Footer
} from './styles';

const DesktopView = () => {
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState(null);

  const handleSubmit = async (serviceType) => {
    if (!eventId.trim()) {
      setError('請輸入活動代碼');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${config.apiEndpoint}/checkEvent?event=${eventId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '無法取得活動資訊');
      }

      if (!data.isAccessible) {
        setError(data.message || '活動未開放');
        return;
      }

      setServiceInfo({
        type: serviceType,
        eventInfo: {
          id: eventId,
          name: data.eventName,
          message: data.message
        }
      });
      
    } catch (err) {
      setError(err.message || '系統發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  // 處理返回按鈕
  const handleReset = () => {
    setEventId('');
    setServiceInfo(null);
    setError('');
  };

  // 生成 QR Code URL
  const generateQRUrl = () => {
    const currentUrl = window.location.origin;
    return `${currentUrl}/${serviceInfo.type}/mobile?event=${serviceInfo.eventInfo.id}`;
  };

  // 如果已經選擇服務並驗證成功，顯示 QR Code
  if (serviceInfo) {
    return (
      <Container>
        <Card>
          <EventTitle>
            <h1>{serviceInfo.eventInfo.name}</h1>
            <button onClick={handleReset} className="reset-button">
              返回
            </button>
          </EventTitle>
          
          <Description>
            請使用手機掃描下方 QR Code 開始分析
          </Description>
          
          <QRContainer>
            <QRCodeSVG
              value={generateQRUrl()}
              size={240}
              level="H"
              includeMargin={true}
            />
          </QRContainer>

          <InstructionList>
            <Instruction number="1">
              請使用手機相機掃描 QR Code
            </Instruction>
            <Instruction number="2">
              掃描後會進入面相大師分析您的面相及運勢
            </Instruction>
            <Instruction number="3">
              拍攝完成後，會由Amazon Bedrock進行分析
            </Instruction>
          </InstructionList>
        </Card>

        <Footer>
          © 2024 Amazon Web Services Solutions Architect. All rights reserved.
        </Footer>
      </Container>
    );
  }

  // 顯示初始服務選擇畫面
  return (
    <Container>
      <Card>
        <Title>🔮 體驗 Amazon Bedrock 🔮</Title>
        <Description>
          請輸入活動代碼，選擇想要體驗的服務
        </Description>

        <Input
          type="text"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="請輸入活動代碼"
          disabled={isLoading}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonGroup>
          <Button 
            onClick={() => handleSubmit('face')}
            disabled={isLoading || !eventId.trim()}
          >
            {isLoading ? '載入中...' : '🌝 面相大師'}
          </Button>
          <Button 
            onClick={() => handleSubmit('fortune')}
            disabled={isLoading || !eventId.trim()}
          >
            {isLoading ? '載入中...' : '🎋 解籤大師'}
          </Button>
        </ButtonGroup>
      </Card>

      <Footer>
        © 2024 Amazon Web Services Solutions Architect. All rights reserved.
      </Footer>
    </Container>
  );
};

export default DesktopView;