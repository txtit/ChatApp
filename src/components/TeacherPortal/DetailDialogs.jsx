import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Divider,
  Alert
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  ViewIcon
} from "@mui/icons-material";

export const StudentDetailDialog = ({
  open,
  onClose,
  student,
  getScoreColor,
  getScoreLabel
}) => {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="h6">Chi tiết học sinh</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={student.avatar}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                {student.name.charAt(0)}
              </Avatar>
              <Typography variant="h6">
                {student.name}
              </Typography>
              <Chip label={student.behavior} color="primary" sx={{ mt: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Email phụ huynh:
                </Typography>
                <Typography variant="body1">
                  {student.parentEmail}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại:
                </Typography>
                <Typography variant="body1">
                  {student.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Ghi chú:
                </Typography>
                <Typography variant="body1">
                  {student.notes}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Kết quả học tập
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {student.math}
                  </Typography>
                  <Typography variant="body2">Toán học</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {student.english}
                  </Typography>
                  <Typography variant="body2">Tiếng Anh</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {student.science}
                  </Typography>
                  <Typography variant="body2">Khoa học</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Điểm danh:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={student.attendance}
                sx={{ mt: 1, height: 8 }}
              />
              <Typography variant="caption">
                {student.attendance}%
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Bài tập: {student.completed}/{student.assignments} hoàn thành
              </Typography>
              <LinearProgress
                variant="determinate"
                value={student.completed / student.assignments * 100}
                sx={{ mt: 1, height: 8 }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" startIcon={<EditIcon />}>
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AssignmentDetailDialog = ({
  open,
  onClose,
  assignment,
  getStatusColor,
  getStatusText
}) => {
  if (!assignment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="h6">Chi tiết bài tập</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant="h5" gutterBottom>
            {assignment.title}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Môn học:
              </Typography>
              <Typography variant="body1">
                {assignment.subject}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Hạn nộp:
              </Typography>
              <Typography variant="body1">
                {assignment.dueDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Điểm tối đa:
              </Typography>
              <Typography variant="body1">
                {assignment.points}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái:
              </Typography>
              <Chip
                label={getStatusText(assignment.status)}
                color={getStatusColor(assignment.status)}
                size="small"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Mô tả bài tập
          </Typography>
          <Typography variant="body1" paragraph>
            {assignment.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Tiến độ nộp bài
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Đã nộp: {assignment.submitted}/{assignment.total} học sinh
            </Typography>
            <LinearProgress
              variant="determinate"
              value={assignment.submitted / assignment.total * 100}
              sx={{ mt: 1, height: 8 }}
            />
            <Typography variant="caption">
              {(assignment.submitted / assignment.total * 100).toFixed(1)}%
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            Còn {assignment.total - assignment.submitted} học sinh chưa nộp bài
            tập này.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="outlined" startIcon={<EditIcon />}>
          Chỉnh sửa
        </Button>
        <Button variant="contained" startIcon={<ViewIcon />}>
          Xem bài nộp
        </Button>
      </DialogActions>
    </Dialog>
  );
};
