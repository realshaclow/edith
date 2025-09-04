import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Stack
} from '@mui/material';
import { StudyPagination } from '../types';

interface StudyPaginationProps {
  pagination: StudyPagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

const pageSizeOptions = [10, 20, 50, 100];

export const StudyPaginationComponent: React.FC<StudyPaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false
}) => {
  const { page, pageSize, total, totalPages } = pagination;

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const handlePageSizeChange = (event: any) => {
    onPageSizeChange(event.target.value);
  };

  // Don't render if no data
  if (total === 0) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      flexWrap="wrap" 
      gap={2}
      py={2}
    >
      {/* Items info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {total} results
      </Typography>

      {/* Pagination controls */}
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Page size selector */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Show:
          </Typography>
          <FormControl size="small">
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={isLoading}
              variant="outlined"
              sx={{ minWidth: 70 }}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Page navigator */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          disabled={isLoading}
          color="primary"
          showFirstButton
          showLastButton
          size="medium"
        />
      </Stack>
    </Box>
  );
};
