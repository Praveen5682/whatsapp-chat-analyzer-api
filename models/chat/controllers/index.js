const chatUploadSchemaValidation = require("../chatValidator");
const service = require("../services/index");

module.exports.uploadChat = async (req, res) => {
  try {
    const { error, value } = chatUploadSchemaValidation.validate({
      file: req.file,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const response = await service.uploadChat(req.file);

    return res.status(201).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getChatData = async (req, res) => {
  try {
    const response = await service.getChatData();

    if (response.error) {
      return res.status(400).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
