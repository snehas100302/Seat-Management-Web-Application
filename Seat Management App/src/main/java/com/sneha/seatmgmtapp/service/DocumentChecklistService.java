package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.DocumentChecklistRequest;
import com.sneha.seatmgmtapp.dto.response.DocumentChecklistResponse;
import com.sneha.seatmgmtapp.enums.DocumentStatus;

import java.util.List;

public interface DocumentChecklistService {
    DocumentChecklistResponse create(DocumentChecklistRequest request);
    DocumentChecklistResponse getById(Long id);
    List<DocumentChecklistResponse> getByApplicantId(Long applicantId);
    DocumentChecklistResponse updateStatus(Long id, DocumentStatus status);
    void delete(Long id);
}

