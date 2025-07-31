import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for assessments
export const fetchAssessments = createAsyncThunk(
  'assessments/fetchAssessments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/assessments', { params });
      return response.data.data || response.data; // Handle both response structures
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assessments'
      );
    }
  }
);

export const fetchAssessmentById = createAsyncThunk(
  'assessments/fetchAssessmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assessment'
      );
    }
  }
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/assessments', assessmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create assessment'
      );
    }
  }
);

export const updateAssessment = createAsyncThunk(
  'assessments/updateAssessment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/assessments/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update assessment'
      );
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  'assessments/deleteAssessment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assessments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete assessment'
      );
    }
  }
);

export const duplicateAssessment = createAsyncThunk(
  'assessments/duplicateAssessment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assessments/${id}/duplicate`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to duplicate assessment'
      );
    }
  }
);

export const publishAssessment = createAsyncThunk(
  'assessments/publishAssessment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/assessments/${id}/publish`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to publish assessment'
      );
    }
  }
);

export const archiveAssessment = createAsyncThunk(
  'assessments/archiveAssessment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/assessments/${id}/archive`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to archive assessment'
      );
    }
  }
);

export const fetchAssessmentStatistics = createAsyncThunk(
  'assessments/fetchAssessmentStatistics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assessments/${id}/statistics`);
      return { id, statistics: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assessment statistics'
      );
    }
  }
);

export const addCollaborator = createAsyncThunk(
  'assessments/addCollaborator',
  async ({ id, email, permissions }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/assessments/${id}/collaborators`, {
        email,
        permissions
      });
      return { id, collaborator: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add collaborator'
      );
    }
  }
);

export const removeCollaborator = createAsyncThunk(
  'assessments/removeCollaborator',
  async ({ id, collaboratorId }, { rejectWithValue }) => {
    try {
      await api.delete(`/assessments/${id}/collaborators/${collaboratorId}`);
      return { id, collaboratorId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove collaborator'
      );
    }
  }
);

const initialState = {
  assessments: [],
  currentAssessment: null,
  statistics: {},
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  publishLoading: false,
  archiveLoading: false,
  statisticsLoading: false,
  collaboratorLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    status: 'all',
    category: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  }
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAssessment: (state) => {
      state.currentAssessment = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateAssessmentInList: (state, action) => {
      const index = state.assessments.findIndex(
        assessment => assessment._id === action.payload._id
      );
      if (index !== -1) {
        state.assessments[index] = action.payload;
      }
    },
    removeAssessmentFromList: (state, action) => {
      state.assessments = state.assessments.filter(
        assessment => assessment._id !== action.payload
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = action.payload.assessments || action.payload || [];
        if (action.payload.page) {
          state.pagination = {
            page: action.payload.page,
            limit: action.payload.limit,
            total: action.payload.total,
            pages: action.payload.pages
          };
        }
        state.error = null;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Assessment By ID
      .addCase(fetchAssessmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssessment = action.payload;
        state.error = null;
      })
      .addCase(fetchAssessmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Assessment
      .addCase(createAssessment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.createLoading = false;
        state.assessments.unshift(action.payload);
        state.currentAssessment = action.payload;
        state.error = null;
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      
      // Update Assessment
      .addCase(updateAssessment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentAssessment = action.payload;
        const index = state.assessments.findIndex(
          assessment => assessment._id === action.payload._id
        );
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete Assessment
      .addCase(deleteAssessment.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.assessments = state.assessments.filter(
          assessment => assessment._id !== action.payload
        );
        if (state.currentAssessment?._id === action.payload) {
          state.currentAssessment = null;
        }
        state.error = null;
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      
      // Duplicate Assessment
      .addCase(duplicateAssessment.fulfilled, (state, action) => {
        state.assessments.unshift(action.payload);
      })
      
      // Publish Assessment
      .addCase(publishAssessment.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
      })
      .addCase(publishAssessment.fulfilled, (state, action) => {
        state.publishLoading = false;
        state.currentAssessment = action.payload;
        const index = state.assessments.findIndex(
          assessment => assessment._id === action.payload._id
        );
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(publishAssessment.rejected, (state, action) => {
        state.publishLoading = false;
        state.error = action.payload;
      })
      
      // Archive Assessment
      .addCase(archiveAssessment.pending, (state) => {
        state.archiveLoading = true;
        state.error = null;
      })
      .addCase(archiveAssessment.fulfilled, (state, action) => {
        state.archiveLoading = false;
        state.currentAssessment = action.payload;
        const index = state.assessments.findIndex(
          assessment => assessment._id === action.payload._id
        );
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(archiveAssessment.rejected, (state, action) => {
        state.archiveLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Assessment Statistics
      .addCase(fetchAssessmentStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.error = null;
      })
      .addCase(fetchAssessmentStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics[action.payload.id] = action.payload.statistics;
        state.error = null;
      })
      .addCase(fetchAssessmentStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload;
      })
      
      // Add Collaborator
      .addCase(addCollaborator.pending, (state) => {
        state.collaboratorLoading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state, action) => {
        state.collaboratorLoading = false;
        if (state.currentAssessment && state.currentAssessment._id === action.payload.id) {
          state.currentAssessment.collaborators.push(action.payload.collaborator);
        }
        state.error = null;
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.collaboratorLoading = false;
        state.error = action.payload;
      })
      
      // Remove Collaborator
      .addCase(removeCollaborator.fulfilled, (state, action) => {
        if (state.currentAssessment && state.currentAssessment._id === action.payload.id) {
          state.currentAssessment.collaborators = state.currentAssessment.collaborators.filter(
            collaborator => collaborator._id !== action.payload.collaboratorId
          );
        }
      });
  }
});

export const {
  clearError,
  clearCurrentAssessment,
  setFilters,
  setPagination,
  updateAssessmentInList,
  removeAssessmentFromList
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer;
