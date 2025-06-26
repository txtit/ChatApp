import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Grid
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Assessment as AssessmentIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";

export const AssignmentCard = ({
  assignment,
  onView,
  onDelete,
  getStatusColor,
  getStatusText
}) =>
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      "&:hover": { boxShadow: 4 },
      transition: "box-shadow 0.3s"
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {assignment.title}
        </Typography>
        <Chip
          label={getStatusText(assignment.status)}
          color={getStatusColor(assignment.status)}
          size="small"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {assignment.description.length > 100
          ? `${assignment.description.substring(0, 100)}...`
          : assignment.description}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
          Hạn nộp: {assignment.dueDate}
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <TaskIcon sx={{ mr: 1, fontSize: 16 }} />
          Môn: {assignment.subject}
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AssessmentIcon sx={{ mr: 1, fontSize: 16 }} />
          Điểm tối đa: {assignment.points}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Đã nộp: {assignment.submitted}/{assignment.total}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={assignment.submitted / assignment.total * 100}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={() => onView(assignment)}
        >
          Xem chi tiết
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(assignment.id)}
        >
          Xóa
        </Button>
      </Box>
    </CardContent>
  </Card>;

export const AssignmentGrid = ({
  assignments,
  onViewAssignment,
  onDeleteAssignment,
  getStatusColor,
  getStatusText
}) =>
  <Grid container spacing={3}>
    {assignments.map(assignment =>
      <Grid item xs={12} md={6} lg={4} key={assignment.id}>
        <AssignmentCard
          assignment={assignment}
          onView={onViewAssignment}
          onDelete={onDeleteAssignment}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </Grid>
    )}
  </Grid>;
